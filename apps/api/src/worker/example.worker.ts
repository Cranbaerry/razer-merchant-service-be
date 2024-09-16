import { InjectQueue, Processor } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Worker } from './worker';

interface ExampleData {
  userId: string;
}

@Processor(ExampleWorker.name, { concurrency: 1 })
export class ExampleWorker extends Worker<ExampleData> {
  constructor(
    @InjectQueue(ExampleWorker.name)
    protected readonly queue: Queue<ExampleData>,
  ) {
    super(queue);
  }

  async addJob(data: ExampleData): Promise<void> {
    await this.queue.add(ExampleWorker.name, data);
  }

  async addJobs(data: ExampleData[]): Promise<void> {
    await this.queue.addBulk(
      data.map((d) => ({ name: ExampleWorker.name, data: d })),
    );
  }

  async process(job: Job<ExampleData>): Promise<void> {
    //
  }
}
