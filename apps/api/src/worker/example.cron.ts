import { InjectQueue, Processor } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Worker } from './worker';

@Processor(ExampleCron.name, { concurrency: 1 })
export class ExampleCron extends Worker {
  constructor(@InjectQueue(ExampleCron.name) protected readonly queue: Queue) {
    super(queue, {
      pattern: '0 10 * * *',
      tz: 'Asia/Singapore',
    });
  }

  async addJob(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async addJobs(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async process(): Promise<void> {
    //
  }
}
