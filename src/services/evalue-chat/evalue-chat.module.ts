import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EvalueChatService } from './evalue-chat.service';

@Module({
  imports: [HttpModule.register({
    baseURL: process.env.EVALUE_CHAT_URL
  })],
  controllers: [],
  providers: [EvalueChatService],
  exports: [EvalueChatService]
})
export class EvalueChatModule {}
