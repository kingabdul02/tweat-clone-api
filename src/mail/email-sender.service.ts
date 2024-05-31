import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailDataDto } from './mail.dto';

@Injectable()
export class EmailSenderService {
  async sendEmail(data: MailDataDto) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'mail.smartapps.com.ng',
        port: 465,
        secure: true,
        auth: {
          user: 'testmail@smartapps.com.ng', 
          pass: '$R!_mn7748tR', 
        },
      });

      const emails = data.to; 
      for (const recipient of emails) {
        await transporter.sendMail({
          to: recipient.trim(),
          from: 'testmail@smartapps.com.ng',
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
