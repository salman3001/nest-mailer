import { Kafka, KafkaConfig } from 'kafkajs';
import { KafkaAdapter } from './KafkaAdapter';

export const getKafakaAdapter = (config: KafkaConfig) => {
  if (!Kafka) {
    throw new Error(
      'Kafka js  is not installed. Please install it using "npm install  kafkajs".',
    );
  }
  const kafka = new Kafka(config);
  return new KafkaAdapter(kafka);
};
