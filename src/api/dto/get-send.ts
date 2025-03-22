// query-params.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class sendMessageQueryParams {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  set_to: string;

  @ApiProperty()
  @IsString()
  set_msg: string;

  @ApiProperty()
  @IsString()
  token: string;


  @ApiPropertyOptional({ enum: ['sim', 'nao'] })
  @IsString()
  @IsOptional()
  gerar_pdf: string;
}
