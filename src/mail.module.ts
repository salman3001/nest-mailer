import { DynamicModule, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailModuleConfig } from './interfaces/MailModuleConfig';
import { getNodemailerTransport } from './utils/transporters/nodemailer/getNodemailer';
import { getSendgridTransport } from './utils/transporters/sendgrid/getSendgridTransporter';
import { NEST_MAIL_TRANSPORTER } from './constants/NEST_MAIL_TRANSPORTER';
import { getKafakaAdapter } from './utils/queue-adapters/kafka/getKafkaAdapter';
import { NEST_MAIL_QUEUE_ADAPTOR } from './constants/NEST_MAIL_QUEUE_ADAPTOR';
import { QueueAdapter } from './interfaces/QueueAdapter';

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
          useFactory: async (queueAdapter: QueueAdapter) => {
            const transporter = (() => {
              if (opt.transporter === 'nodemailer') {
                return getNodemailerTransport(opt.options, queueAdapter);
              } else if (opt.transporter === 'sendgrid') {
                return getSendgridTransport(opt.options, queueAdapter);
              } else {
                throw new Error('Invalid transporter specified.');
              }
            })();

            return transporter;
          },
          inject: [{ token: NEST_MAIL_QUEUE_ADAPTOR, optional: true }],
        },

        {
          provide: NEST_MAIL_QUEUE_ADAPTOR,
          useFactory: async () => {
            const queueAdapter =
              opt.queueAdapter?.name === 'Kafkajs'
                ? await getKafakaAdapter(opt.queueAdapter.options)
                : opt.queueAdapter?.name === 'Not Imlemented'
                ? undefined
                : undefined;

            return queueAdapter;
          },
        },
      ],
      exports: [MailService],
      global: true,
    };
  }
}
