import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailDataDto } from './mail.dto';

@Injectable()
export class EmailSenderService {
  async sendEmail(data: MailDataDto) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: process.env.MAIL_SECURE === 'true',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      const emails = data.to;
      for (const recipient of emails) {
        await transporter.sendMail({
          to: recipient.trim(),
          from: process.env.MAIL_FROM,
          subject: data.subject,
          text: data.text,
          html: data.html,
        });
        console.log(`Email sent successfully to ${recipient}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
