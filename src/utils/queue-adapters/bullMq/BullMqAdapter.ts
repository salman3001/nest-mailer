import type { Message, Producer } from 'kafkajs';
import { QueueAdapter } from '../../../interfaces/QueueAdapter';
import { NestMailError } from '../../../exceptions/NestMailError';
import { NestMail } from '../../../interfaces/NestMail';
import type { Queue } from 'bullmq';

export class BullMqAdapter implements QueueAdapter {
  constructor(private readonly emailQueue: Queue) {}

  async queue(mails: NestMail[]): Promise<void> {
    try {
      for (const mail of mails) {
        await this.emailQueue.add('new-email', mail);
      }
    } catch (error) {
      throw new NestMailError('Failed to queue email in kafka');
    }
  }
}
