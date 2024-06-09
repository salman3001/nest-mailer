import { Test } from '@nestjs/testing';
import { MailModule } from '../../src/mail.module';
import { MailService } from '../../src/mail.service';

describe('mail module', () => {
  let mailservice: MailService;
  const moduleOptions1: Parameters<(typeof MailModule)['register']>[0] = {
    transporter: 'nodemailer',
    options: {},
  };

  const moduleOptions2: Parameters<(typeof MailModule)['register']>[0] = {
    transporter: 'nodemailer',
    options: {},
    queueAdapter: {
      name: 'Kafkajs',
      options: { brokers: ['invalid'] },
    },
  };

  let OptionstoUse = moduleOptions1;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      imports: [MailModule.register(OptionstoUse)],
    }).compile();
    mailservice = testModule.get(MailService);
  });

  // it('main service should be defined', () => {
  //   expect(mailservice).toBeDefined();
  //   OptionstoUse = moduleOptions2;
  // });

  it('throw error', () => {
    // expect(mailservice).toBeDefined();
  });
});
