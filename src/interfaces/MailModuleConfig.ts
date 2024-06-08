import { KafkaConfig } from 'kafkajs';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface QueAdapterBasecofnig {
  name: 'Kafkajs' | 'Not Imlemented';
}

interface KafakaAdapterConfig extends QueAdapterBasecofnig {
  name: 'Kafkajs';
  options: KafkaConfig;
}

interface NotImplementedAdapter extends QueAdapterBasecofnig {
  name: 'Not Imlemented';
  options: {};
}

export interface BaseConfig {
  transporter: 'nodemailer' | 'sendgrid';
  queueAdapter?: KafakaAdapterConfig | NotImplementedAdapter;
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
