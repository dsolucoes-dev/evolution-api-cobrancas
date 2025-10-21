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
          }
        )
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);

      throw new Error(JSON.stringify(error.response.data) || error.message);
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
            fileName: randomUUID(),
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
      console.log('error', error.response.data.response || error);

      throw new Error(JSON.stringify(error.response.data) || error);
    }
  }
}
