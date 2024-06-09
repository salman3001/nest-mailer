import { Kafka, KafkaConfig } from 'kafkajs';
import { KafkaAdapter } from './KafkaAdapter';
import { NestMailError } from '../../../exceptions/NestMailError';

export const getKafakaAdapter = async (config: KafkaConfig) => {
  if (!Kafka) {
    throw new NestMailError(
      'Kafka js  is not installed. Please install it using "npm install  kafkajs".',
    );
  }

  const kafka = new Kafka(config);
  const producer = kafka.producer();
  try {
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
  } catch (error) {
    throw new NestMailError('Failed to connect to kafka');
  }

  return new KafkaAdapter(producer);
};
