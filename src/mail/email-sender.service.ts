import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailDataDto } from './mail.dto';

@Injectable()
export class EmailSenderService {
  async sendEmail(data: any) {
    console.log('Emails sent ssending.', data.data);
    const payload = data.data;
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

      payload.recipients.forEach(async (email) => {
        const mailOptions = {
          from: payload.from,
          to: email,
          subject: payload.subject,
          text: payload.text,
          html: payload.html,
        };
    
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Emails sent successfully.', payload);
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

