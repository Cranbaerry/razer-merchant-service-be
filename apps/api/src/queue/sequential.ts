export interface Job {
  id: string;
  fn: () => void | Promise<void>;
}

export class SequentialQueue {
  private jobs: Job[] = [];

  public addJob(data: Job) {
    const existingJob = this.jobs.find((j) => j.id === data.id);

    if (!existingJob) {
      this.jobs.push(data);
    }

    if (this.jobs.length === 1) {
      this.runQueue();
    }
  }

  private async runQueue() {
    const job = this.jobs[0];
    if (!job) return;

    try {
      await job.fn();
    } catch (e) {
      console.error(e);
    } finally {
      this.jobs.shift();
      await this.runQueue();
    }
  }
}
