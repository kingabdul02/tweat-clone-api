export class MailDataDto {
    to: string[];
    from: string;
    subject: string;
    text: string; 
    html?: string; 
    context?: any; 
  }
  