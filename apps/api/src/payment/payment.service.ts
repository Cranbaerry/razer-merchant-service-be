import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios'
import * as crypto from 'crypto';
import { GenerateHostedPaymentPageDto, PaymentDataDto, OrderDetailsDto, ProcessOrderDto } from './payment.dto';
import { HttpException, HttpStatus } from '@nestjs/common'
@Injectable()
export class PaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) { }

  generateHostedPaymentPage(params: GenerateHostedPaymentPageDto): string {
    const merchantId = this.configService.get<string>('RAZER_MERCHANT_ID');
    const paymentTemplateUrl = this.configService.get<string>('RAZER_PAYMENT_URL');
    const returnUrl = this.configService.get<string>('RAZER_RETURN_URL');
    const callbackUrl = this.configService.get<string>('RAZER_CALLBACK_URL');
    const paymentUrl = paymentTemplateUrl
      .replace('{MerchantID}', merchantId)
      .replace('{PaymentMethod}', '');

    // Return URL: realtime web browser or frontend direction endpoint for hosted page
    // Notification URL (webhook): real-time server-to-server or backend endpoint for all kind of integrations
    // Callback URL (webhook): defer update or callback endpoint on non-real time payment

    const queryParams = new URLSearchParams({
      amount: params.amount,
      orderid: params.orderId,
      bill_name: params.billName,
      bill_email: params.billEmail,
      bill_mobile: params.billMobile,
      bill_desc: params.billDesc,
      country: params.country,
      vcode: params.vCode,
      returlurl: returnUrl,
      callbackurl: callbackUrl
    }).toString();

    return `${paymentUrl}?${queryParams}`;
  }

  processOrder(data: ProcessOrderDto): OrderDetailsDto {
    const {
      payment_options,
      total_amount,
      billingFirstName,
      billingLastName,
      billingEmail,
      billingMobile,
      billingAddress,
      currency,
      razertimer,
    }: ProcessOrderDto = data;

    const merchantId = this.configService.get<string>('RAZER_MERCHANT_ID');
    const verifyKey = this.configService.get<string>('RAZER_VERIFY_KEY');
    const cancelUrl = this.configService.get<string>('RAZER_CANCEL_URL');
    const returnUrl = this.configService.get<string>('RAZER_RETURN_URL');
    const callbackUrl = this.configService.get<string>('RAZER_CALLBACK_URL');

    if (payment_options && payment_options !== '') {
      const yourOrderId = `TEST${Math.floor(Math.random() * 1000000)}`;
      const yourProcessStatus = true; // Your process logic here

      if (yourProcessStatus === true) {
        const vcode = crypto.createHash('md5')
          .update(total_amount + merchantId + yourOrderId + verifyKey)
          .digest('hex');

        const order: OrderDetailsDto = {
          status: true,
          mpsmerchantid: merchantId,
          mpschannel: payment_options,
          mpsamount: total_amount,
          mpsorderid: yourOrderId,
          mpsbill_name: `${billingFirstName} ${billingLastName}`,
          mpsbill_email: billingEmail,
          mpsbill_mobile: billingMobile,
          mpsbill_desc: billingAddress,
          mpscountry: 'MY',
          mpsvcode: vcode,
          mpscurrency: currency,
          mpslangcode: 'en',
          mpstimer: razertimer ? parseInt(razertimer) : '',
          mpstimerbox: '#counter',
          mpscancelurl: cancelUrl,
          mpsreturnurl: returnUrl,
          mpscallbackurl: callbackUrl,
          mpsapiversion: '3.28',
        };

        return order;
      } else throw new HttpException('Invalid process status', HttpStatus.BAD_REQUEST);
    } else throw new HttpException('Invalid payment option', HttpStatus.BAD_REQUEST);
  }

  verifyDataIntegrity(data: PaymentDataDto): boolean {
    const secretKey = this.configService.get<string>('RAZER_SECRET_KEY')
    const key0 = crypto.createHash('md5').update(`${data.tranID}${data.orderid}${data.status}${data.domain}${data.amount}${data.currency}`).digest('hex');
    const key1 = crypto.createHash('md5').update(`${data.paydate}${data.domain}${key0}${data.appcode}${secretKey}`).digest('hex');

    return data.skey === key1;
  }

  async acknowledgeData(data: PaymentDataDto): Promise<any> {
    // Advanced back-end scripting: 
    // Merchant is to echo back all the POST variables 
    // ..with one additional variable, “treq” with value 1

    data['treq'] = 1;
    const checkSumURL = this.configService.get<string>('RAZER_ACKNOWLEDGE_URL');
    const postData = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
    const response = await this.httpService.post(checkSumURL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).toPromise();

    return response.data;
  }
}
