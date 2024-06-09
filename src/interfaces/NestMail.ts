export interface NestMail {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
  setHtml(payload: any): void;
}
