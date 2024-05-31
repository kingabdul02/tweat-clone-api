import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MailDataDto } from './mail.dto';

@Injectable()
export class MailService {
  constructor(@InjectQueue('emailQueue') private readonly emailQueue: Queue) {}

  async sendEmail(data: MailDataDto) {
    try {
      await this.emailQueue.add('sendEmail', data);
      console.log('Email added to queue successfully.');
    } catch (error) {
      console.error('Error adding email to queue:', error);
    }
  }
}
