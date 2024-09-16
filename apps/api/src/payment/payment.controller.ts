import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDataDto, PaymentStatus, GenerateHostedPaymentPageDto, ProcessOrderDto } from './payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('generate-hpp')
  generateHostedPaymentPage(
    @Body() data: GenerateHostedPaymentPageDto,
  ) {
    try {
      const url = this.paymentService.generateHostedPaymentPage(data);

      return {
        status: 'success',
        data: {
          url,
        },
        message: 'Successfuly retrieved',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        data: null,
        message: `Error occurred: ${error.message}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('process-order')
  handleProcessOrder(@Body() data: ProcessOrderDto) {
    try {
      const order = this.paymentService.processOrder(data);

      return {
        status: 'success',
        data: {
          order,
        },
        message: 'Successfuly retrieved',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        data: null,
        message: `Error occurred: ${error.message}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('notification')
  async handleNotification(@Body() data: PaymentDataDto) {
    try {
      console.log('Payment notification received:', JSON.stringify(data, null, 2));
      if (!this.paymentService.verifyDataIntegrity(data)) {
        console.log("Invalid transaction");
        throw new HttpException('Invalid transaction', HttpStatus.BAD_REQUEST);
      }
      const response = await this.paymentService.acknowledgeData(data);
      if (data.status !== PaymentStatus.SUCCESS) {
        console.log("Invalid transaction (2)");
        throw new HttpException(`Invalid payment status: ${data.status}`, HttpStatus.NOT_ACCEPTABLE);
      }

      // TODO: Add check for orderid and amount
      // checkCartAmount(orderId, amount)

      // If nbcb, it's a payment status update / deferred update
      // TODO: Handle deferred update (care: transactions can be duplicate) 
      if (data.nbcb) return 'CBTOKEN:MPSTATOK';
      return {
        status: 'success',
        data: response,
        message: null,
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        message: `Error occurred: ${error.message}`,
      };
    }
  }


  // This is just for a test, should be removed in production
  @Post('return')
  handleReturnUrl(@Body() data: any) {
    return data;
  }
}
