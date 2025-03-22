import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ApiService } from './api.service';
import { sendMessageQueryParams } from './dto/get-send';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  @ApiOperation({ summary: 'Listar produtos com filtros' })
  @ApiOkResponse({
    description: 'Lista de produtos retornada com sucesso',
  })
  async sendManual(
    @Query() query: sendMessageQueryParams,
    @Res() res: Response,
  ) {
    try {
       await this.apiService.sendManual(query);
       res.status(200).json({ message: 'Mensagem enviada com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
