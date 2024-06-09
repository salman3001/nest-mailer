import kafkaModule, { Kafka } from 'kafkajs';
import { getKafakaAdapter } from '../../../../../src/utils/queue-adapters/kafka/getKafkaAdapter';
import { KafkaAdapter } from '../../../../../src/utils/queue-adapters/kafka/KafkaAdapter';

jest.mock('kafkajs');
jest.mock('../../../../../src/utils/queue-adapters/kafka/KafkaAdapter');

describe.only('getKafkaAdapter', () => {
  test('should return kafka adapter', async () => {
    (kafkaModule.Kafka as jest.Mock).mockImplementationOnce(() => ({
      producer: jest.fn().mockReturnValue({
        connect: jest.fn().mockResolvedValue({}),
        send: jest.fn().mockResolvedValue({}),
      }),
    }));

    (KafkaAdapter as jest.Mock).mockReturnValueOnce(
      new KafkaAdapter({} as any),
    );

    const results = await getKafakaAdapter({} as any);
    expect(Kafka).toHaveBeenCalled();
    expect(results).toBeInstanceOf(KafkaAdapter);
  });
});
