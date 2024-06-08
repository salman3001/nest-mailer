import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { NodemailerTransporter } from './NodeMailerTransporter';
import { NodemailerConfig } from '../../../interfaces/MailModuleConfig';
import { QueueAdapter } from '../../../interfaces/QueueAdapter';

export const getNodemailerTransport = (
  opt: NodemailerConfig['options'],
  queueAdapter?: QueueAdapter,
) => {
  if (!nodemailer) {
    throw new Error(
      'Nodemailer is not installed. Please install it using "npm install nodemailer".',
    );
  }
  const transporter = nodemailer.createTransport(opt);
  return new NodemailerTransporter(transporter, queueAdapter);
};
