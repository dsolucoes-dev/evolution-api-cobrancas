import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { firstValueFrom } from 'rxjs';
import { SendMediaMessage, SendPlaneText } from './dto/sendPlaneText';

@Injectable()
export class EvalueChatService {
  constructor(private readonly httpService: HttpService) {}

  async sendMessage(data: SendPlaneText) {
    try {
      let numberWithCountryCode: string;
      if (data.numero.includes('@')) {
        numberWithCountryCode = data.numero;
      } else if (data.numero.startsWith('55')) {
        numberWithCountryCode = data.numero;
      } else {
        numberWithCountryCode = `55${data.numero}`;
      }

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
          }
        )
      );
    } catch (error) {
      console.log(JSON.stringify(error.response.data.response.message));

      throw new Error(error.message);
    }
  }

  async sendMessageMedia(data: SendMediaMessage) {
    try {
      const numberWithCountryCode = data.numero.startsWith('55')
        ? data.numero
        : `55${data.numero}`;

      await firstValueFrom(
        this.httpService.post(
          `/message/sendMedia/${data.instancia}`,
          {
            number: numberWithCountryCode,
            mediatype: 'document',
            mimetype: 'application/pdf',
            caption: data.mensagem,
            media: data.media[0],
            fileName: `${randomUUID()}.pdf`,
          },
          {
            headers: {
              apikey: `${data.token}`,
            },
          }
        )
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('========== ERRO COMPLETO sendMessageMedia ==========');
      // eslint-disable-next-line no-console
      console.log('error.response?.status:', error?.response?.status);
      // eslint-disable-next-line no-console
      console.log('error.response?.statusText:', error?.response?.statusText);
      // eslint-disable-next-line no-console
      console.log(
        'error.response?.data:',
        JSON.stringify(error?.response?.data, null, 2)
      );
      // eslint-disable-next-line no-console
      console.log('error.response?.headers:', error?.response?.headers);
      // eslint-disable-next-line no-console
      console.log('error.message:', error?.message);
      // eslint-disable-next-line no-console
      console.log(
        'error completo:',
        JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
      );
      // eslint-disable-next-line no-console
      console.log('====================================================');

      const errorData = error?.response?.data || {};
      const errorMessage =
        errorData?.message || error?.message || 'Erro desconhecido';

      throw new Error(
        typeof errorMessage === 'string'
          ? errorMessage
          : JSON.stringify(errorMessage)
      );
    }
  }
}
