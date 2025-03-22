import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { EvalueChatModule } from './services/evalue-chat/evalue-chat.module';

@Module({
  imports: [ApiModule, EvalueChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
