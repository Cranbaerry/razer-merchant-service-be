import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class NotificationService {
  constructor(private readonly mailService: MailerService) {}

  async sendEmail(req: ISendMailOptions) {
    await this.mailService.sendMail(req);
  }

  async sendPushNotification(
    userId: number,
    content: { title: string; message: string },
    data?: Record<string, any>,
  ) {
    await getMessaging().send({
      topic: userId.toString(),
      notification: {
        title: content.title,
        body: content.message,
      },
      android: {
        priority: 'high',
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
      data,
    });
  }
}
