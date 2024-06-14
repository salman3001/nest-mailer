import { NodemailerTransporter } from './NodeMailerTransporter';
import { NodemailerConfig } from '../../../interfaces/MailModuleConfig';
import { QueueAdapter } from '../../../interfaces/QueueAdapter';
import { NestMailError } from '../../../exceptions/NestMailError';

export const getNodemailerTransport = async (
  opt: NodemailerConfig['options'],
  queueAdapter?: QueueAdapter,
) => {
  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport(opt);
    return new NodemailerTransporter(transporter, queueAdapter);
  } catch (error) {
    console.error('Nodemailer is not installed');

    throw new NestMailError(
      'Nodemailer is not installed. Please install it using "npm install nodemailer".',
    );
  }
};
