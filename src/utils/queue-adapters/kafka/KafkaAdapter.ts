import { Kafka, Message, Producer } from 'kafkajs';
import { QueueAdapter } from '../../../interfaces/QueueAdapter';
import { NestMailError } from '../../../exceptions/NestMailError';
import { NestMail } from '../../../interfaces/NestMail';

export class KafkaAdapter implements QueueAdapter {
  producer: Producer;

  constructor(private readonly kafka: Kafka) {
    this.producer = kafka.producer();
    this.producer
      .connect()
      .then(() => {
        console.log('connected to kafka');
        process.on('SIGINT', async () => {
          this.producer.disconnect();
          process.exit(0);
        });

        process.on('SIGTERM', async () => {
          this.producer.disconnect();
          process.exit(0);
        });
      })
      .catch(() => {
        throw new NestMailError('Failed to connect to kafka');
      });
  }

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
