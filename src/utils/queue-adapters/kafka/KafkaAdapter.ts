import type { Message, Producer } from 'kafkajs';
import { QueueAdapter } from '../../../interfaces/QueueAdapter';
import { NestMailError } from '../../../exceptions/NestMailError';
import { NestMail } from '../../../interfaces/NestMail';

export class KafkaAdapter implements QueueAdapter {
  constructor(private readonly producer: Producer) {}

  async queue(mails: NestMail[]): Promise<void> {
    const messages: Message[] = mails.map((mail) => ({
      value: JSON.stringify(mail),
    }));
    try {
      await this.producer.send({ topic: 'send-email', messages });
    } catch (error) {
      throw new NestMailError('Failed to queue email in kafka');
    }
  }
}
