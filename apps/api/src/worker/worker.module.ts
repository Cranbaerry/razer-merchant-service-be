import { Module, Provider } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { Worker } from './worker';
import { ConfigModule } from '@nestjs/config';
import { Constructor } from 'type-fest';
import { ConnectionOptions } from 'bullmq';

const workers: Provider<Worker>[] = [];

function getConnection(): ConnectionOptions {
  return {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    tls: {},
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev',
    }),
    BullModule.forRoot({
      connection: getConnection(),
    }),
    ...workers.map((worker) =>
      BullModule.registerQueue({
        name: (worker as Constructor<Worker>).name,
        connection: getConnection(),
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: 1000,
          removeOnFail: 1000,
        },
      }),
    ),
  ],
  providers: workers,
  exports: workers,
})
export class WorkerModule {}
