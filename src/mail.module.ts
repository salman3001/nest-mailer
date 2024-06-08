import { DynamicModule, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailModuleConfig } from './interfaces/MailModuleConfig';
import { getNodemailerTransport } from './utils/transporters/nodemailer/getNodemailer';
import { getSendgridTransport } from './utils/transporters/sendgrid/getSendgridTransporter';
import { NEST_MAIL_TRANSPORTER } from './constants/NEST_MAIL_TRANSPORTER';
import { getKafakaAdapter } from './utils/queue-adapters/kafka/getKafkaAdapter';

@Module({})
export class MailModule {
  static register(opt: MailModuleConfig): DynamicModule {
    const queueAdapter =
      opt.queueAdapter?.name === 'Kafkajs'
        ? getKafakaAdapter(opt.queueAdapter.options)
        : opt.queueAdapter?.name === 'Not Imlemented'
        ? undefined
        : undefined;
    return {
      module: MailModule,
      providers: [
        MailService,
        {
          provide: NEST_MAIL_TRANSPORTER,
          useValue:
            opt.transporter === 'nodemailer'
              ? getNodemailerTransport(opt.options, queueAdapter)
              : opt.transporter === 'sendgrid'
              ? getSendgridTransport(opt.options, queueAdapter)
              : null,
        },
      ],
      exports: [MailService],
      global: true,
    };
  }
}
