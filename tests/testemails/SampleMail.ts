import { NestMail } from '../../src/interfaces/NestMail';

interface SampleMailPayload {
  name: string;
}

export class SampleMail implements NestMail {
  from: 'from';
  subject: 'This is an test email';
  text: 'Test email';
  to: string;
  html: string;

  setHtml(payload: SampleMailPayload): void {
    this.html = `<h1>HI ${payload.name}</>`;
  }

  constructor(to: string, payload: SampleMailPayload) {
    this.to = to;
    this.setHtml(payload);
  }
}
