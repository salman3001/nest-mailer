import { DynamicModule, Module, Provider } from '@nestjs/common';
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
    const transporterProvider: Provider = {
      provide: NEST_MAIL_TRANSPORTER,
      useFactory: async (queueAdapter: QueueAdapter | undefined) => {
        if (opt.transporter === 'nodemailer') {
          return await getNodemailerTransport(opt.options, queueAdapter);
        } else if (opt.transporter === 'sendgrid') {
          return await getSendgridTransport(opt.options, queueAdapter);
        } else {
          throw new Error('Invalid transporter specified.');
        }
      },
      inject: [{ token: NEST_MAIL_QUEUE_ADAPTOR, optional: true }],
    };

    const queueAdapterProvider: Provider = {
      provide: NEST_MAIL_QUEUE_ADAPTOR,
      useFactory: async () => {
        if (opt.queueAdapter?.name === 'Kafkajs') {
          return await getKafakaAdapter(opt.queueAdapter.options);
        }
        return undefined;
      },
    };

    return {
      module: MailModule,
      providers: [MailService, transporterProvider, queueAdapterProvider],
      exports: [MailService],
      global: true,
    };
  }

  static registerAsync(options: {
    inject: any[];
    useFactory: (
      ...args: any[]
    ) => Promise<MailModuleConfig> | MailModuleConfig;
  }): DynamicModule {
    const transporterProvider: Provider = {
      provide: NEST_MAIL_TRANSPORTER,
      useFactory: async (
        queueAdapter: QueueAdapter | undefined,
        ...args: any[]
      ) => {
        const config = await options.useFactory(...args);
        if (config.transporter === 'nodemailer') {
          return await getNodemailerTransport(config.options, queueAdapter);
        } else if (config.transporter === 'sendgrid') {
          return await getSendgridTransport(config.options, queueAdapter);
        } else {
          throw new Error('Invalid transporter specified.');
        }
      },
      inject: [
        { token: NEST_MAIL_QUEUE_ADAPTOR, optional: true },
        ...options.inject,
      ],
    };

    const queueAdapterProvider: Provider = {
      provide: NEST_MAIL_QUEUE_ADAPTOR,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        if (config.queueAdapter?.name === 'Kafkajs') {
          return await getKafakaAdapter(config.queueAdapter.options);
        }
        return undefined;
      },
      inject: options.inject,
    };

    return {
      module: MailModule,
      providers: [MailService, transporterProvider, queueAdapterProvider],
      exports: [MailService],
      global: true,
    };
  }
}
