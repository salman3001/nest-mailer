import { Test } from '@nestjs/testing';
import { MailModule } from '../../src/mail.module';
import { MailService } from '../../src/mail.service';
import { SampleMail } from '../testemails/SampleMail';
import { NodemailerTransporter } from '../../src/utils/transporters/nodemailer/NodeMailerTransporter';
import { NEST_MAIL_TRANSPORTER } from '../../src/constants/NEST_MAIL_TRANSPORTER';
import { NestMailError } from '../../src/exceptions/NestMailError';

describe('nodemailer integration test', () => {
  let mailservice: MailService;
  let transporter: NodemailerTransporter;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      imports: [
        MailModule.register({
          transporter: 'nodemailer',
          options: {},
        }),
      ],
    }).compile();
    mailservice = testModule.get(MailService);
    transporter = testModule.get(NEST_MAIL_TRANSPORTER);
  });

  it('main service should be defined', () => {
    expect(mailservice).toBeDefined();
  });

  it('should be nodemailer transporter', async () => {
    expect(transporter).toBeInstanceOf(NodemailerTransporter);
  });

  it('should call send method', async () => {
    jest.spyOn(transporter, 'send').mockImplementationOnce(jest.fn());
    await mailservice.send(
      new SampleMail('salman@gmail.com', { name: 'salman' }),
    );
    expect(transporter.send).toHaveBeenCalled();
  });

  it('should send email by nodemailer', async () => {
    jest
      .spyOn(transporter.nodemailer, 'sendMail')
      .mockImplementationOnce(jest.fn());
    await mailservice.send(
      new SampleMail('salman@gmail.com', { name: 'salman' }),
    );

    expect(transporter.nodemailer.sendMail).toHaveBeenCalled();
  });

  it('should throw nestmailer error if nodemailer fails to send email', async () => {
    jest
      .spyOn(transporter.nodemailer, 'sendMail')
      .mockImplementationOnce(jest.fn().mockRejectedValueOnce({}));
    expect.assertions(1);
    try {
      await mailservice.send(
        new SampleMail('salman@gmail.com', { name: 'salman' }),
      );
    } catch (error) {
      expect(error).toBeInstanceOf(NestMailError);
    }
  });

  it('should send mail in sync if no queuue adapter', async () => {
    jest
      .spyOn(transporter.nodemailer, 'sendMail')
      .mockImplementation(jest.fn());

    await mailservice.queue([
      new SampleMail('salman@gmail.com', { name: 'salman' }),
      new SampleMail('salman@gmail.com', { name: 'salman' }),
    ]);
    expect(transporter.nodemailer.sendMail).toHaveBeenCalledTimes(2);
    jest.clearAllMocks();
  });
});
