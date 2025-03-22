import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EvalueChatService } from './evalue-chat.service';

@Module({
  imports: [HttpModule.register({
    baseURL: 'https://evolution.somaxsis.dev.br'
  })],
  controllers: [],
  providers: [EvalueChatService],
  exports: [EvalueChatService]
})
export class EvalueChatModule {}
