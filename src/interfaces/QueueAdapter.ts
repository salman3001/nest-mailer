import { NestMail } from './NestMail';

export interface QueueAdapter {
  queue(mails: NestMail[]): Promise<void>;
}
