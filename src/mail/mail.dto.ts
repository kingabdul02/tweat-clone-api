export class MailDataDto {
    recipients: string[];
    from: string;
    subject: string;
    text: string; 
    html?: string; 
    context?: any; 
  }
  


export class MailRecipientDto {
  email_address!: string;
}