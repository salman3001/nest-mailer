import { NestMail } from './NestMail';

export interface BaseTransporter {
  send(mail: NestMail): Promise<void>;
  queue(mails: NestMail[]): Promise<void>;
}
