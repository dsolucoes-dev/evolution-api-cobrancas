import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { sendMessageQueryParams } from './dto/get-send';

@Injectable()
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(data: sendMessageQueryParams) {
    const { gerar_pdf, mensagem, numero, token } = data;
    
    // Extrair URLs da mensagem
    const urls = this.extractUrlsFromMessage(mensagem);
    
    // Array para armazenar as URLs em formato base64
    const base64Urls = [];
    
    

    if (gerar_pdf === 'sim') {
      if (urls.length > 0) {
        for (const url of urls) {
          try {
            const base64Data = await this.downloadAndConvertToBase64(url);
            base64Urls.push({
              originalUrl: url,
              base64Data: base64Data
            });
          } catch (error) {
            console.error(`Erro ao baixar a URL ${url}:`, error.message);
          }
        }
      }
    }


    return {
      mensagem,
      urls,
      base64Urls
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
    const urlRegex = /(https?:\/\/|www\.)[^\s,()<>]+(?:\([\w\d]+\)|([^,()<>!\s]|\([^,()<>!\s]*\)))/gi;
    
    // Encontrar todas as ocorrências da regex na mensagem
    const matches = message.match(urlRegex);
    
    // Retornar array vazio se não encontrar URLs
    return matches || [];
  }

  /**
   * Baixa uma URL e converte o conteúdo para base64
   * @param url - A URL para ser baixada
   * @returns Uma Promise com a string em formato base64
   */
  private async downloadAndConvertToBase64(url: string): Promise<string> {
    // Garantir que a URL tenha o protocolo
    const validUrl = url.startsWith('http') ? url : `https://${url}`;
    
    try {
      // Fazer requisição HTTP para obter os dados da URL
      const response = await firstValueFrom(
        this.httpService.get(validUrl, {
          responseType: 'arraybuffer'
        })
      );
      
      // Converter o buffer para base64
      const base64 = Buffer.from(response.data).toString('base64');
      
      return base64;
    } catch (error) {
      console.error(`Erro ao baixar a URL ${validUrl}:`, error.message);
      throw error;
    }
  }
}