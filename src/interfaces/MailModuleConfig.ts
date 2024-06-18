import type { QueueOptions } from 'bullmq';
import type { KafkaConfig } from 'kafkajs';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

interface QueAdapterBasecofnig {
  name: 'Kafkajs' | 'BullMq' | 'Not Imlemented';
}

interface KafakaAdapterConfig extends QueAdapterBasecofnig {
  name: 'Kafkajs';
  options: KafkaConfig;
}

interface BullMqAdapter extends QueAdapterBasecofnig {
  name: 'BullMq';
  options: QueueOptions;
}

interface NotImplementedAdapter extends QueAdapterBasecofnig {
  name: 'Not Imlemented';
  options: {};
}

export interface BaseConfig {
  transporter: 'nodemailer' | 'sendgrid';
  queueAdapter?: KafakaAdapterConfig | NotImplementedAdapter | BullMqAdapter;
}

export interface NodemailerConfig extends BaseConfig {
  transporter: 'nodemailer';
  options: SMTPTransport.Options;
}

export interface SendGridConfig extends BaseConfig {
  transporter: 'sendgrid';
  options: { apiKey: string };
}

export type MailModuleConfig = NodemailerConfig | SendGridConfig;
