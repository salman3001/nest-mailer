import { SendgridTransporter } from './SendgridTransporter';
import { QueueAdapter } from '../../../interfaces/QueueAdapter';
import { NestMailError } from '../../../exceptions/NestMailError';

export const getSendgridTransport = async (
  opt: { apiKey: string },
  queueAdapter?: QueueAdapter,
) => {
  try {
    // @ts-ignore
    const { default: sgMail } = await import('@sendgrid/mail');
    sgMail.setApiKey(opt.apiKey);

    return new SendgridTransporter(sgMail, queueAdapter);
  } catch (error) {
    throw new NestMailError(
      'Sendgrid is not installed. Please install it using "npm install @sendgrid/mail".',
    );
  }
};
