import sgMail from '@sendgrid/mail';
import { SendgridTransporter } from './SendgridTransporter';
import { QueueAdapter } from '../../../interfaces/QueueAdapter';
import { NestMailError } from '../../../exceptions/NestMailError';

export const getSendgridTransport = (
  opt: { apiKey: string },
  queueAdapter?: QueueAdapter,
) => {
  if (!sgMail) {
    throw new NestMailError(
      'Sendgrid is not installed. Please install it using "npm install @sendgrid/mail".',
    );
  }

  sgMail.setApiKey(opt.apiKey);

  return new SendgridTransporter(sgMail, queueAdapter);
};
