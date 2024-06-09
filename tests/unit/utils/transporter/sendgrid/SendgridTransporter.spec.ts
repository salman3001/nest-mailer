import { QueueAdapter } from '../../../../../src/interfaces/QueueAdapter';
import { SampleMail } from '../../../../testemails/SampleMail';
import { NestMailError } from '../../../../../src/exceptions/NestMailError';
import { SendgridTransporter } from '../../../../../src/utils/transporters/sendgrid/SendgridTransporter';
import { MailService } from '@sendgrid/mail';

describe('sendGridTransporter', () => {
  let sendGridTransporter: SendgridTransporter;
  let transporter = {
    send: jest.fn(),
  } as unknown as MailService;
  let queueAdapter = undefined as unknown as QueueAdapter;

  beforeEach(() => {
    sendGridTransporter = new SendgridTransporter(transporter, queueAdapter);
  });
  test('it should be defined', () => {
    expect(sendGridTransporter).toBeDefined();
  });

  test('it should call send method', async () => {
    await sendGridTransporter.send(
      new SampleMail('salman@gmail.com', { name: 'salman' }),
    );
    expect(transporter.send).toHaveBeenCalled();
  });

  test('it should throw nestmail error', async () => {
    jest
      .spyOn(transporter, 'send')
      .mockRejectedValueOnce(new Error('failed to send email'));
    expect.assertions(1);
    try {
      await sendGridTransporter.send(
        new SampleMail('salman@gmail.com', { name: 'salman' }),
      );
    } catch (error) {
      expect(error).toBeInstanceOf(NestMailError);
    }
  });

  test('warn about no queue adapter, uses sync email', async () => {
    jest.spyOn(sendGridTransporter, 'send').mockImplementationOnce(jest.fn());
    await sendGridTransporter.queue([
      new SampleMail('salman@gmail.com', { name: 'salman' }),
      new SampleMail('salman@gmail.com', { name: 'salman' }),
    ]);
    expect(sendGridTransporter.send).toHaveBeenCalledTimes(2);
    //seting queue adapter
    queueAdapter = {
      queue: jest.fn(),
    };
  });

  test('should put the emails in queue', async () => {
    await sendGridTransporter.queue([
      new SampleMail('salman@gmail.com', { name: 'salman' }),
      new SampleMail('salman@gmail.com', { name: 'salman' }),
    ]);
    expect(queueAdapter.queue).toHaveBeenCalledTimes(1);
  });
});
