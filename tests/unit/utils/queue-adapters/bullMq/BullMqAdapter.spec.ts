import { Queue } from 'bullmq';
import { BullMqAdapter } from '../../../../../src/utils/queue-adapters/bullMq/BullMqAdapter';
import { NestMailError } from '../../../../../src/exceptions/NestMailError';
import { SampleMail } from '../../../../testemails/SampleMail';

jest.mock('bullmq', () => ({
  _esModule: true,
  Queue: jest.fn(),
}));

describe('BullMqAdapter', () => {
  const queue = { add: jest.fn() } as unknown as Queue;
  let bullMqAdapter: BullMqAdapter;

  beforeEach(() => {
    bullMqAdapter = new BullMqAdapter(queue);
  });

  test('should be defined', () => {
    expect(bullMqAdapter).toBeDefined();
  });

  test('should throw nest mail error if queue failed', async () => {
    try {
      jest.spyOn(queue, 'add').mockImplementationOnce(() => {
        throw new Error();
      });
      await bullMqAdapter.queue([
        new SampleMail('salman@gmail.com', { name: 'salman' }),
        new SampleMail('salman@gmail.com', { name: 'salman' }),
      ]);
    } catch (error) {
      expect(error).toBeInstanceOf(NestMailError);
    }
  });
});
