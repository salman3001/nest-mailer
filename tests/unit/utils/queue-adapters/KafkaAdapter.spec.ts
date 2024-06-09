import { Kafka } from 'kafkajs';
import { KafkaAdapter } from '../../../../src/utils/queue-adapters/kafka/KafkaAdapter';
import { NestMailError } from '../../../../src/exceptions/NestMailError';
import { SampleMail } from '../../../testemails/SampleMail';

jest.mock('kafkajs', () => ({
  _esModule: true,
  Kafka: jest.fn().mockImplementation(() => ({
    producer: jest.fn().mockReturnValue({
      connect: jest.fn().mockResolvedValue({}),
      send: jest.fn().mockResolvedValue({}),
    }),
  })),
}));

describe('KafkaAdapter', () => {
  let kafka: Kafka;

  beforeEach(() => {
    kafka = new Kafka({} as any);
  });

  test('should be defined', () => {
    const producer = kafka.producer();
    const kafkaAdapter = new KafkaAdapter(producer);
    expect(kafkaAdapter).toBeDefined();
  });

  test('should throw nest mail error if queue failed', async () => {
    try {
      const producer = kafka.producer();
      const adapter = new KafkaAdapter(producer);
      jest.spyOn(producer, 'send').mockRejectedValueOnce({});
      await adapter.queue([
        new SampleMail('salman@gmail.com', { name: 'salman' }),
        new SampleMail('salman@gmail.com', { name: 'salman' }),
      ]);
    } catch (error) {
      expect(error).toBeInstanceOf(NestMailError);
    }
  });
});
