import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
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
  sendManual(@Query() query: sendMessageQueryParams) {
    return this.apiService.findAll();
  }

}
