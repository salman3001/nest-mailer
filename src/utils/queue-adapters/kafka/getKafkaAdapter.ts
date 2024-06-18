import type { KafkaConfig } from 'kafkajs';
import { KafkaAdapter } from './KafkaAdapter';
import { NestMailError } from '../../../exceptions/NestMailError';

export const getKafakaAdapter = async (config: KafkaConfig) => {
  try {
    const { Kafka } = await import('kafkajs');
    const kafka = new Kafka(config);
    try {
      const producer = kafka.producer();
      await producer.connect();
      console.log('connected to kafka');
      process.on('SIGINT', async () => {
        producer.disconnect();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        producer.disconnect();
        process.exit(0);
      });
      return new KafkaAdapter(producer);
    } catch (error) {
      throw new NestMailError(
        'Failed to connect to kafka! is kafkajs installed or is config correct?',
      );
    }
  } catch (error) {
    throw new NestMailError(
      'Kafka js  is not installed. Please install it using "npm install  kafkajs".',
    );
  }
};
