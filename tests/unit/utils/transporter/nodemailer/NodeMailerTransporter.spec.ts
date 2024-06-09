import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { NodemailerTransporter } from '../../../../../src/utils/transporters/nodemailer/NodeMailerTransporter';
import nodemailer from 'nodemailer';
import { QueueAdapter } from '../../../../../src/interfaces/QueueAdapter';
import { SampleMail } from '../../../../testemails/SampleMail';
import { NestMailError } from '../../../../../src/exceptions/NestMailError';

describe('NodeMailerTransporter', () => {
  let nodemailerTransporter: NodemailerTransporter;
  let transporter = {
    sendMail: jest.fn(),
  } as unknown as nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  let queueAdapter = undefined as unknown as QueueAdapter;

  beforeEach(() => {
    nodemailerTransporter = new NodemailerTransporter(
      transporter,
      queueAdapter,
    );
  });
  test('it should be defined', () => {
    expect(NodemailerTransporter).toBeDefined();
  });

  test('it should call send method', async () => {
    await nodemailerTransporter.send(
      new SampleMail('salman@gmail.com', { name: 'salman' }),
    );
    expect(transporter.sendMail).toHaveBeenCalled();
  });

  test('it should throw nestmail error', async () => {
    jest
      .spyOn(transporter, 'sendMail')
      .mockRejectedValueOnce(new Error('failed to send email'));
    expect.assertions(1);
    try {
      await nodemailerTransporter.send(
        new SampleMail('salman@gmail.com', { name: 'salman' }),
      );
    } catch (error) {
      expect(error).toBeInstanceOf(NestMailError);
    }
  });

  test('warn about no queue adapter, uses sync email', async () => {
    jest.spyOn(nodemailerTransporter, 'send').mockImplementationOnce(jest.fn());
    await nodemailerTransporter.queue([
      new SampleMail('salman@gmail.com', { name: 'salman' }),
      new SampleMail('salman@gmail.com', { name: 'salman' }),
    ]);
    expect(nodemailerTransporter.send).toHaveBeenCalledTimes(2);
    //seting queue adapter
    queueAdapter = {
      queue: jest.fn(),
    };
  });

  test('should put the emails in queue', async () => {
    await nodemailerTransporter.queue([
      new SampleMail('salman@gmail.com', { name: 'salman' }),
      new SampleMail('salman@gmail.com', { name: 'salman' }),
    ]);
    expect(queueAdapter.queue).toHaveBeenCalledTimes(1);
  });
});
