import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { EvalueChatModule } from './services/evalue-chat/evalue-chat.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ApiModule,
    EvalueChatModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
