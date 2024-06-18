import { Queue } from 'bullmq';
import { getBullMqAdapter } from '../../../../../src/utils/queue-adapters/bullMq/getBullMqAdapter';
import { BullMqAdapter } from '../../../../../src/utils/queue-adapters/bullMq/BullMqAdapter';

jest.mock('bullmq');
jest.mock('../../../../../src/utils/queue-adapters/bullMq/BullMqAdapter');

describe.only('getBullMqAdapter', () => {
  test('should return kafka adapter', async () => {
    (Queue as unknown as jest.Mock).mockImplementationOnce(jest.fn());

    (BullMqAdapter as jest.Mock).mockReturnValueOnce(
      new BullMqAdapter({} as any),
    );

    const results = await getBullMqAdapter({} as any);
    expect(Queue).toHaveBeenCalled();
    expect(results).toBeInstanceOf(BullMqAdapter);
  });
});
