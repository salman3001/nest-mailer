import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../../src/mail.service';
import { MailModule } from '../../src/mail.module';
import { BaseTransporter } from '../../src/interfaces/BaseTransporter';
import { NEST_MAIL_TRANSPORTER } from '../../src/constants/NEST_MAIL_TRANSPORTER';
import { NodemailerTransporter } from '../../src/utils/transporters/nodemailer/NodeMailerTransporter';
import { SendgridTransporter } from '../../src/utils/transporters/sendgrid/SendgridTransporter';
import { SampleMail } from '../testemails/SampleMail';
import { QueueAdapter } from '../../src/interfaces/QueueAdapter';

describe('mail service', () => {
  let service: MailService;
  let transporter: BaseTransporter;
  let queueAdapter: QueueAdapter;

  const nodemailerConfig = {
    transporter: 'nodemailer' as 'nodemailer',
    options: {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'maddison53@ethereal.email',
        pass: 'jn7jnAPss4f63QBp6D',
      },
    },
  };

  const sendGridConfig = {
    transporter: 'sendgrid' as 'sendgrid',
    options: {
      apiKey: 'your api key',
    },
  };

  let currentTransporterConfig: any = nodemailerConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule.register(currentTransporterConfig)],
    }).compile();

    service = module.get(MailService);
    transporter = module.get(NEST_MAIL_TRANSPORTER);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('transporter should be nodemailer', () => {
    expect(transporter).toBeInstanceOf(NodemailerTransporter);
    currentTransporterConfig = sendGridConfig;
  });

  // it('transporter should be sendgrid', () => {
  //   expect(transporter).toBeInstanceOf(SendgridTransporter);
  // });

  // it('should call transport send method', () => {
  //   jest.spyOn(transporter, 'send').mockImplementationOnce(jest.fn());
  //   service.send(new SampleMail('salman@gmail.com', { name: 'salman' }));
  //   expect(transporter.send).toHaveBeenCalled();
  // });

  // it('should call transport queue method', () => {
  //   jest.spyOn(transporter, 'queue').mockImplementationOnce(jest.fn());
  //   service.queue([
  //     new SampleMail('salman@gmail.com', { name: 'salman' }),
  //     new SampleMail('salman@gmail.com', { name: 'salman' }),
  //   ]);
  //   expect(transporter.queue).toHaveBeenCalled();
  // });
});
