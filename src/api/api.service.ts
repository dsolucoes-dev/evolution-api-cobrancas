import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { firstValueFrom } from 'rxjs';
import { EvalueChatService } from 'src/services/evalue-chat/evalue-chat.service';
import { PrismaService } from 'src/services/prisma.service';
import { sendMessageQueryParams } from './dto/get-send';

@Injectable()
export class ApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly evalueChatService: EvalueChatService,
    private readonly prismaService: PrismaService,
  ) {}

  async sendManual(data: sendMessageQueryParams) {
    const { gerar_pdf, mensagem, numero, token, key } = data;
    // Extrair URLs da mensagem
    const urls = this.extractUrlsFromMessage(mensagem);
    // Array para armazenar as URLs em formato base64
    const base64Urls = [];

    if (gerar_pdf === 'sim') {
      if (urls.length > 0) {
        for (const url of urls) {
          try {
            const base64Data = await this.downloadAndConvertToBase64(url, true);
            base64Urls.push({
              originalUrl: url,
              base64Data: base64Data,
            });
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(
              `Erro ao baixar a URL ${url}:`,
              JSON.stringify(error),
            );
          }
        }
      }
    } else {
      if (urls.length > 0) {
        for (const url of urls) {
          try {
            const base64Data = await this.downloadAndConvertToBase64(
              url,
              false,
            );
            base64Urls.push({
              originalUrl: url,
              base64Data: base64Data,
            });
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(
              `Erro ao baixar a URL ${url}:`,
              JSON.stringify(error),
            );
          }
        }
      }
    }

    if (base64Urls.length > 0 && gerar_pdf === 'sim') {
      await this.evalueChatService.sendMessageMedia({
        instancia: key,
        mensagem: mensagem,
        numero: numero,
        token: token,
        media: base64Urls.map((url) => url.base64Data),
      });
    } else {
      await this.evalueChatService.sendMessage({
        instancia: data.key,
        mensagem: mensagem,
        numero: numero,
        token: token,
      });
    }

    return {
      mensagem,
      urls,
      base64Urls,
    };
  }

  /**
   * Extrai todas as URLs de uma string
   * @param message - A mensagem de texto para extrair URLs
   * @returns Um array contendo todas as URLs encontradas na mensagem
   */
  private extractUrlsFromMessage(message: string): string[] {
    if (!message) return [];
    // Regex para encontrar URLs (suporta HTTP, HTTPS, FTP e URLs sem protocolo)
    const urlRegex =
      /(https?:\/\/|www\.)[^\s,()<>]+(?:\([\w\d]+\)|([^,()<>!\s]|\([^,()<>!\s]*\)))/gi;
    // Encontrar todas as ocorrências da regex na mensagem
    const matches = message.match(urlRegex);
    // Retornar array vazio se não encontrar URLs
    return matches || [];
  }

  /**
   * Baixa uma URL e converte o conteúdo para base64
   * @param url - A URL para ser baixada
   * @param convertToPdf - Indica se deve converter o conteúdo HTML para PDF
   * @returns Uma Promise com a string em formato base64
   */
  private async downloadAndConvertToBase64(
    url: string,
    convertToPdf: boolean = false,
  ): Promise<string> {
    // Garantir que a URL tenha o protocolo
    const validUrl = url.startsWith('http') ? url : `https://${url}`;

    try {
      if (convertToPdf) {
        // Iniciar o navegador Puppeteer para converter HTML para PDF
        const browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        // Navegar até a URL
        await page.goto(validUrl, {
          waitUntil: 'networkidle2', // Espera até que a página esteja carregada
          timeout: 30000, // Tempo limite de 30 segundos
        });

        // Gerar o PDF
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px',
          },
        });

        // Fechar o navegador
        await browser.close();

        // Converter o buffer do PDF para base64
        return Buffer.from(pdfBuffer).toString('base64');
      } else {
        // Fazer requisição HTTP para obter os dados da URL (comportamento original)
        const response = await firstValueFrom(
          this.httpService.get(validUrl, {
            responseType: 'arraybuffer',
          }),
        );

        // Converter o buffer para base64
        return Buffer.from(response.data).toString('base64');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Erro ao processar a URL ${validUrl}:`, error.message);
      throw error;
    }
  }

  async getMetricas(token: string, key: string) {
    try {
      // Buscar a instância
      const evolutionInstance = await this.prismaService.instance.findFirst({
        where: {
          token: token,
          name: key,
        },
      });

      if (!evolutionInstance) {
        throw new NotFoundException('Evolution instance not found');
      }

      // Buscar apenas as últimas mensagens enviadas
      const ultimasMensagensEnviadas =
        await this.prismaService.message.findMany({
          where: {
            instanceId: evolutionInstance.id,
            key: {
              path: ['fromMe'],
              equals: true,
            },
          },
          orderBy: {
            messageTimestamp: 'desc',
          },
          take: 30,
          select: {
            id: true,
            key: true,
            pushName: true,
            messageType: true,
            message: true,
            messageTimestamp: true,
            status: true,
          },
        });

      return {
        instancia: {
          id: evolutionInstance.id,
          nome: evolutionInstance.name,
          numero: evolutionInstance.number,
          statusConexao: evolutionInstance.connectionStatus,
          criadoEm: evolutionInstance.createdAt,
        },
        mensagens: {
          ultimasMensagensEnviadas: ultimasMensagensEnviadas.map((msg) => ({
            id: msg.id,
            remoteJid: msg.key['remoteJid'],
            pushName: msg.pushName,
            tipo: msg.messageType,
            conteudo: msg.message,
            timestamp: new Date(msg.messageTimestamp * 1000).toISOString(),
            status: msg.status,
          })),
        },
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao buscar métricas:', error);

      // Re-throw o erro para que seja tratado pelo NestJS
      throw error;
    }
  }
}
