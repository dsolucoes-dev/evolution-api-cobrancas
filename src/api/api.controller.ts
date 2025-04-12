import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { sendMessageTriggerProducerService } from 'src/jobs/sendMessageTrigger/sendMessageProducer';
import { ApiService } from './api.service';
import { sendMessageQueryParams } from './dto/get-send';

@Controller('/')
export class ApiController {
  constructor(private readonly apiService: ApiService,     private sendMessageTriggerProducerService: sendMessageTriggerProducerService,
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
      
      console.log('Enviando mensagem:', query.mensagem);
      

      const id = await this.sendMessageTriggerProducerService.sendMessageTriggerJob(query);
        res.status(200).send(`Mensagem enviada com sucesso, id: ${id}`);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
