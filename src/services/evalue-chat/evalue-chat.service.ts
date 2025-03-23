import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { SendMediaMessage, SendPlaneText } from './dto/sendPlaneText';

@Injectable()
export class EvalueChatService {
  constructor(private readonly httpService: HttpService) {}

  async sendMessage(data: SendPlaneText) {
    try {
      const isValidNumberWithCountryCode = /^[1-9]\d{1,14}$/;

      const numberWithCountryCode = data.numero.startsWith('55') 
        ? data.numero 
        : `55${data.numero}`;

      await firstValueFrom(
        this.httpService.post(
          `/message/sendText/${data.instancia}`,
          {
        number: numberWithCountryCode,
        text: data.mensagem,
          },
          {
        headers: {
          apikey: `${data.token}`,
        },
          },
        ),
      );
    } catch (error) {
      console.log('error', error);

      throw new Error(JSON.stringify(error.response.data) || error.message);
    }
  }

  async sendMessageMedia(data: SendMediaMessage) {
    
    try {
      const isValidNumberWithCountryCode = /^\[1-9]\d{1,14}$/;

      console.log(isValidNumberWithCountryCode.test(data.numero)
      ? data.numero
      : `55${data.numero}
      `);
      

      await firstValueFrom(
        this.httpService.post(
          `/message/sendMedia/${data.instancia}`,
          {
            number: isValidNumberWithCountryCode.test(data.numero)
              ? data.numero
              : `55${data.numero}`,
            mediatype: 'document',
            mimetype: 'application/pdf',
            caption: data.mensagem,
            media: data.media[0],
            fileName: 'Fatura.pdf',
          },
          {
            headers: {
              apikey: `${data.token}`,
            },
          },
        ),
      );
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data) || error);
    }
  }
}
