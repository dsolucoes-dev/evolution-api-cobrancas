// query-params.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';


export class sendMessageQueryParams {
  @ApiPropertyOptional({ enum: ['sim', 'nao'] })
  @IsString()
  @IsOptional()
  gerar_pdf: string;

  @ApiPropertyOptional()
  @IsString({always: true})
  numero: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  agendamento: string;

  @ApiPropertyOptional()
  @IsString( {always: true})
  token: string;

  @ApiPropertyOptional()
  @IsString( {always: true})
  mensagem: string;

}