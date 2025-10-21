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

export class sendMessageQueryParamsIXC {
  @ApiProperty()
  @IsString()
  app: string;

  @ApiProperty()
  @IsString()
  u: string;

  @ApiProperty()
  @IsString()
  h: string;

  @ApiProperty()
  @IsString()
  op: string;

  @ApiProperty()
  @IsString()
  to: string;

  @ApiProperty()
  @IsString()
  msg: string;
}
