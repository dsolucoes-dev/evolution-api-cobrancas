import { HttpService } from '@nestjs/axios';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as puppeteer from 'puppeteer';
import { firstValueFrom } from 'rxjs';
import { sendMessageQueryParams } from 'src/api/dto/get-send';
import { EvalueChatService } from 'src/services/evalue-chat/evalue-chat.service';

@Processor('send-message-trigger')
export class sendMessageTriggerConsumer {
  private readonly logger = new Logger(sendMessageTriggerConsumer.name);
  
  constructor(
    private readonly httpService: HttpService,
    private readonly evalueChatService: EvalueChatService,
  ) {}

  @Process('send-message-trigger-job')
  async sendMessager(job: Job<any>) {
    const data = job.data as sendMessageQueryParams;
    return this.sendManual(data);
  }

  async sendManual(data: sendMessageQueryParams) {
    const { gerar_pdf, mensagem, numero, token, key } = data;
    const urls = this.extractUrlsFromMessage(mensagem);
    const base64Urls = [];


    if (urls.length > 0) {
      for (const url of urls) {
        try {
          const base64Data = await this.downloadAndConvertToBase64(url, gerar_pdf === 'sim');
          base64Urls.push({
            originalUrl: url,
            base64Data: base64Data,
          });
        } catch (error) {
          console.error(`Erro ao baixar a URL ${url}:`, error.message);
        }
      }
    }

    
    if (base64Urls.length > 0 && gerar_pdf === 'sim') {
      await this.evalueChatService.sendMessageMedia({
        instancia: data.key,
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
      numero,
      urls,
      base64Urls,
    };
  }

  private extractUrlsFromMessage(message: string): string[] {
    if (!message) return [];
    const urlRegex =
      /(https?:\/\/|www\.)[^\s,()<>]+(?:\([\w\d]+\)|([^,()<>!\s]|\([^,()<>!\s]*\)))/gi;
    const matches = message.match(urlRegex);
    return matches || [];
  }

  private async isPdfUrl(url: string): Promise<boolean> {
    try {
      const validUrl = url.startsWith('http') ? url : `https://${url}`;
      
      if (validUrl.toLowerCase().endsWith('.pdf')) {
        return true;
      }

      const response = await firstValueFrom(
        this.httpService.head(validUrl)
      );
      
      const contentType = response.headers['content-type'];
      return contentType && contentType.includes('application/pdf');
    } catch (error) {
      this.logger.error(`Erro ao verificar se URL é PDF: ${error.message}`);
      return false;
    }
  }

  private async downloadAndConvertToBase64(url: string, convertToPdf: boolean = false): Promise<string> {
    const validUrl = url.startsWith('http') ? url : `https://${url}`;
    
    this.logger.log(`Starting to process URL: ${validUrl}`);
    
    try {
      // Verifica se a URL é um PDF
      const isPdf = await this.isPdfUrl(validUrl);
      
      // Se já for um PDF ou não precisar converter para PDF, apenas baixa e converte para base64
      if (isPdf || !convertToPdf) {
        this.logger.log('Making HTTP request for direct download...');
        const response = await firstValueFrom(
          this.httpService.get(validUrl, {
            responseType: 'arraybuffer',
          }),
        );
        
        this.logger.log('Content downloaded successfully');
        return Buffer.from(response.data).toString('base64');
      } else {
        // Se não for PDF e precisar converter, usa o Puppeteer
        this.logger.log('Launching Puppeteer browser...');
        const browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        
        const page = await browser.newPage();
        this.logger.log('Navigating to page...');
        
        await page.goto(validUrl, {
          waitUntil: 'networkidle2',
          timeout: 30000,
        });
        
        this.logger.log('Generating PDF...');
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
        
        await browser.close();
        this.logger.log('PDF generated successfully');
        
        return Buffer.from(pdfBuffer).toString('base64');
      }
    } catch (error) {
      this.logger.error(`Error processing URL ${validUrl}: ${error.message}`);
      throw error;
    }
  }
}