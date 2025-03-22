import { Injectable } from '@nestjs/common';
import { sendMessageQueryParams } from './dto/get-send';

@Injectable()
export class ApiService {
  async findAll(data: sendMessageQueryParams) {
    const { agendamento, gerar_pdf, mensagem, numero, token } = data;

    
  }
}
