import { Module } from '@nestjs/common';
import { CliService } from './cli.service';
import { ConfigModule } from '@nestjs/config';
import { ConsoleModule } from 'nestjs-console';

@Module({
  imports: [
    ConsoleModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev',
    }),
  ],
  providers: [CliService],
})
export class CliModule {}
