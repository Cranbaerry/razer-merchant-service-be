import { WorkerHost } from '@nestjs/bullmq';
import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { JobsOptions, Queue } from 'bullmq';

export type CronOption = Omit<
  JobsOptions['repeat'],
  'every' | 'immediately'
> & {
  pattern: string;
};

export abstract class Worker<T = any>
  extends WorkerHost
  implements OnApplicationBootstrap
{
  constructor(
    protected readonly queue: Queue,
    private readonly cronOption?: CronOption,
  ) {
    super();
  }
  private get workerName() {
    return this.constructor.name;
  }
  private readonly logger = new Logger(this.workerName);

  abstract addJob(data: T): Promise<unknown>;
  abstract addJobs(data: T[]): Promise<unknown>;

  async onApplicationBootstrap() {
    if (!this.cronOption) return;
    try {
      const cronjobs = await this.queue.getRepeatableJobs();
      const found = cronjobs.filter((job) => job.name === this.workerName);
      const deletable = found.filter(
        (f) => f.pattern !== this.cronOption.pattern,
      );
      const added = found.some((f) => f.pattern === this.cronOption.pattern);
      if (deletable.length) {
        Promise.all(
          deletable.map((d) => this.queue.removeRepeatableByKey(d.key)),
        );
      }
      if (!added) {
        await this.queue.add(this.workerName, null, {
          repeat: this.cronOption,
        });
      }
      this.logger.verbose(`Registered ${this.workerName} job`);
    } catch (e) {
      this.logger.error(`Failed to register ${this.workerName} job`);
      throw e;
    }
  }
}
