// query-params.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class sendMessageQueryParams {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  numero: string;

  @ApiProperty()
  @IsString()
  mensagem: string;

  @ApiProperty()
  @IsString()
  token: string;


  @ApiPropertyOptional({ enum: ['sim', 'nao'] })
  @IsString()
  @IsOptional()
  gerar_pdf: string;
}
