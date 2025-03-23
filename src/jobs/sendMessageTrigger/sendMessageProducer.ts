import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';


@Injectable()
export class sendMessageTriggerProducerService {
  constructor(
    @InjectQueue('send-message-trigger') private sendMessageTriggerQueue: Queue,
  ) {}

  async sendMessageTriggerJob(data: any) {
   const  d = await this.sendMessageTriggerQueue.add('send-message-trigger-job', data, {
      attempts: 3,
      backoff: 5000,
    });

  

    // const jobs = await this.sendMessageTriggerQueue.getJobs(['completed', 'failed']);
    // console.log('Jobs in the queue:', jobs);
    // console.log('Job added to queue');
    
    return `${data.numero}@${d.id}`;
  }
}
