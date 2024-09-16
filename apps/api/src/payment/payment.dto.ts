import { IsEmail, IsNotEmpty, IsString, IsNumberString, IsOptional, isNumber, isNumberString, IsNumber, IsUrl } from 'class-validator';

export class GenerateHostedPaymentPageDto {
  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  billName: string;

  @IsNotEmpty()
  @IsEmail()
  billEmail: string;

  @IsNotEmpty()
  @IsString()
  billMobile: string;

  @IsNotEmpty()
  @IsString()
  billDesc: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  vCode: string;
}

export class PaymentDataDto {
  @IsNotEmpty()
  @IsString()
  tranID: string;

  @IsNotEmpty()
  @IsString()
  orderid: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  domain: string;

  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  appcode?: string;

  @IsNotEmpty()
  @IsString()
  paydate: string;

  @IsNotEmpty()
  @IsString()
  skey: string;

  @IsOptional()
  @IsNumber()
  treq?: number;

  @IsOptional()
  @IsNumberString()
  nbcb?: string;

  @IsOptional()
  @IsString()
  error_code?: string;

  
  @IsOptional()
  @IsString()
  error_desc?: string;
}

export class ProcessOrderDto {
  @IsNotEmpty()
  @IsString()
  payment_options: string;

  @IsNotEmpty()
  @IsNumber()
  total_amount: number;

  @IsNotEmpty()
  @IsString()
  billingFirstName: string;

  @IsNotEmpty()
  @IsString()
  billingLastName: string;

  @IsNotEmpty()
  @IsString()
  billingEmail: string;

  @IsNotEmpty()
  @IsString()
  billingMobile: string;

  @IsNotEmpty()
  @IsString()
  billingAddress: string;

  @IsNotEmpty()
  @IsString()

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  razertimer?: string;
}

export class OrderDetailsDto {
  @IsNotEmpty()
  @IsString()
  status: boolean;

  @IsNotEmpty()
  @IsString()
  mpsmerchantid: string;

  @IsNotEmpty()
  @IsString()
  mpschannel: string;

  @IsNotEmpty()
  @IsNumber()
  mpsamount: number;

  @IsNotEmpty()
  @IsString()
  mpsorderid: string;

  @IsNotEmpty()
  @IsString()
  mpsbill_name: string;

  @IsNotEmpty()
  @IsEmail()
  mpsbill_email: string;

  @IsNotEmpty()
  @IsString()
  mpsbill_mobile: string;

  @IsNotEmpty()
  @IsString()
  mpsbill_desc: string;

  @IsNotEmpty()
  @IsString()
  mpscountry: string;

  @IsNotEmpty()
  @IsString()
  mpsvcode: string;

  @IsNotEmpty()
  @IsString()
  mpscurrency: string;

  @IsNotEmpty()
  @IsString()
  mpslangcode: string;

  @IsOptional()
  @IsNumberString()
  mpstimer?: number | '';

  @IsNotEmpty()
  @IsString()
  mpstimerbox: string;

  @IsNotEmpty()
  @IsUrl()
  mpscancelurl: string;

  @IsNotEmpty()
  @IsUrl()
  mpsreturnurl: string;

  @IsNotEmpty()
  @IsUrl()
  mpscallbackurl: string;

  @IsNotEmpty()
  @IsString()
  mpsapiversion: string;
}

export const PaymentStatus = {
  SUCCESS: '00',  // Successful payment
  FAILED: '11',   // Failed status
  PENDING: '22',  // Pending status
} as const;