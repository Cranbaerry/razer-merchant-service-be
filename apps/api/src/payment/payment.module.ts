import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios'

@Module({
    imports: [ConfigModule, HttpModule],
    providers: [PaymentService],
    controllers: [PaymentController]
})
export class PaymentModule { }
