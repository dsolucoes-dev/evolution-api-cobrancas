import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EvalueChatModule } from 'src/services/evalue-chat/evalue-chat.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [HttpModule, EvalueChatModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
