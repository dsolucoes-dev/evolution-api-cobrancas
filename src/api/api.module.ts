import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { sendMessageTriggerConsumer } from 'src/jobs/sendMessageTrigger/sendMessageConsumer';
import { sendMessageTriggerProducerService } from 'src/jobs/sendMessageTrigger/sendMessageProducer';
import { EvalueChatModule } from 'src/services/evalue-chat/evalue-chat.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [HttpModule, EvalueChatModule, BullModule.forRoot({
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USERNAME,
      db: parseInt(process.env.REDIS_DB) || 0,
    },
  }),
  BullModule.registerQueue({
    name: 'send-message-trigger',
  }),],
  controllers: [ApiController],
  providers: [ApiService, sendMessageTriggerConsumer, sendMessageTriggerProducerService],
})
export class ApiModule {}
