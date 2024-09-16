import { MiddlewareConsumer, Module, NestModule, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalModule } from './global.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentModule } from './payment/payment.module';

const GlobalGuards: Type[] = [JwtAuthGuard];

@Module({
  imports: [
    // MailerModule.forRootAsync({
    //   useFactory: () => {
    //     return {
    //       transport: {
    //         SES: {
    //           ses: new SES({
    //             apiVersion: '2010-12-01',
    //             region: 'ap-southeast-1',
    //             credentials: {
    //               accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //               secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //             },
    //           }),
    //           aws: { SendRawEmailCommand },
    //         },
    //         sendingRate: 10,
    //         maxConnections: 2,
    //       },
    //       defaults: {
    //         from: '<email>',
    //       },
    //     };
    //   },
    // }),
    // MailerModule.forRootAsync({
    //   useFactory: () => {
    //     return {
    //       transport: 'smtps://<email>:<password>@<email server>',
    //       defaults: {
    //         from: '"<From Name>" <<email>>',
    //       },
    //     };
    //   },
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev',
    }),
    GlobalModule,
    EventEmitterModule.forRoot(),
    UserModule,
    // WorkerModule,
    // StorageModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [
    // TODO: Add guards back
    // ...GlobalGuards.map((guard) => ({
    //   provide: APP_GUARD,
    //   useClass: guard,
    // })),
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //
  }

  constructor() {
    const serviceAccount = {
      type: 'service_account',
      project_id: '<project-id>',
      private_key_id: '<private-key-id>',
      private_key: '<private-key>',
      client_email: '<service account email>',
      client_id: '<client-id>',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: '<client-x509-cert-url>',
      universe_domain: 'googleapis.com',
    };

    // initializeApp({
    //   credential: cert(serviceAccount as any),
    //   projectId: serviceAccount.project_id,
    // });
  }
}
