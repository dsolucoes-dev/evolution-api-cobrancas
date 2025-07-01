import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { sendMessageTriggerProducerService } from 'src/jobs/sendMessageTrigger/sendMessageProducer';
import {
  sendMessageQueryParams,
  sendMessageQueryParamsIXC,
} from './dto/get-send';

@Controller('/')
export class ApiController {
  constructor(
    private sendMessageTriggerProducerService: sendMessageTriggerProducerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Chamada api via whatsapp' })
  @ApiOkResponse({
    description: 'retorna item a fila',
  })
  async sendManual(
    @Query() query: sendMessageQueryParams,
    @Res() res: Response,
  ) {
    try {
      const id =
        await this.sendMessageTriggerProducerService.sendMessageTriggerJob(
          query,
        );
      res.status(200).send(`Mensagem enviada com sucesso, id: ${id}`);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get('/playsms/index.php')
  @ApiOperation({ summary: 'Chamada api via whatsapp via IXC' })
  @ApiOkResponse({
    description: 'retorna item a fila',
  })
  async sendMessageManual(
    @Query() query: sendMessageQueryParamsIXC,
    @Res() res: Response,
  ) {
    try {
      const { u, h, to, msg } = query;

      const data = {
        key: u,
        numero: to,
        mensagem: msg,
        token: h,
        gerar_pdf: true,
      };

      const id =
        await this.sendMessageTriggerProducerService.sendMessageTriggerJob(
          data,
        );

      return res.status(200).json({
        data: [
          {
            status: 'OK',
            error: 0,
            smslog_id: id.split('@')[1],
            queue: id,
            to: query.to,
            send_in: 'DE!',
          },
        ],
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Post('/')
  @ApiOperation({ summary: 'Chamada api via whatsapp via IXC' })
  @ApiOkResponse({
    description: 'retorna item a fila',
  })
  async sendPostMessageManual(
    @Body() body: sendMessageQueryParams,
    @Res() res: Response,
  ) {
    try {
      const { key, numero, mensagem, token } = body;

      const data = {
        key,
        numero,
        mensagem,
        token,
      };

      const id =
        await this.sendMessageTriggerProducerService.sendMessageTriggerJob(
          data,
        );

      return res.status(200).json({
        status: 'OK',
        id,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
