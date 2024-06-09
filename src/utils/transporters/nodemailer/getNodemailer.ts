import { createTransport } from 'nodemailer';
import { NodemailerTransporter } from './NodeMailerTransporter';
import { NodemailerConfig } from '../../../interfaces/MailModuleConfig';
import { QueueAdapter } from '../../../interfaces/QueueAdapter';
import { NestMailError } from '../../../exceptions/NestMailError';

export const getNodemailerTransport = (
  opt: NodemailerConfig['options'],
  queueAdapter?: QueueAdapter,
) => {
  if (!createTransport) {
    throw new NestMailError(
      'Nodemailer is not installed. Please install it using "npm install nodemailer".',
    );
  }
  const transporter = createTransport(opt);
  return new NodemailerTransporter(transporter, queueAdapter);
};
