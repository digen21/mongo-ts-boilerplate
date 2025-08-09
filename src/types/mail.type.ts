export interface SendMailOptions {
  to: string;
  subject: string;
  template: MailTemplates | string;
  text?: string;
  userId: string;
  token: string;
}

export enum MailTemplates {
  VerificationMail = 'verifyEmail',
}
