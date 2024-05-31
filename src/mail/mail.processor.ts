import { Processor, Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { MailDataDto } from './mail.dto';
import { EmailSenderService } from './email-sender.service';

@Processor('emailQueue')
@Injectable()
export class MailProcessor {
  constructor(
    @Inject(EmailSenderService) private readonly emailSenderService: EmailSenderService,
  ) {}

  @Process('sendEmail')
  async handleSendEmail(data: MailDataDto) {
    try {
      await this.emailSenderService.sendEmail(data);
      console.log('Email sent successfully (via EmailSenderService).');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
