import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class sendMessageTriggerProducerService {
  constructor(
    @InjectQueue('send-message-trigger') private sendMessageTriggerQueue: Queue,
  ) {}

  async sendMessageTriggerJob(data: any) {
    const d = await this.sendMessageTriggerQueue.add(
      'send-message-trigger-job',
      data,
      {
        attempts: 1,
        delay: 3000,
        backoff: 5000,
      },
    );

    return `${data.numero}@${d.id}`;
  }
}
