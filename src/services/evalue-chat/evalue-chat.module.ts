import { Module } from '@nestjs/common';
import { EvalueChatController } from './evalue-chat.controller';
import { EvalueChatService } from './evalue-chat.service';

@Module({
  controllers: [EvalueChatController],
  providers: [EvalueChatService]
})
export class EvalueChatModule {}
