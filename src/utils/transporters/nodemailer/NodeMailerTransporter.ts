import { BaseTransporter } from '../../../interfaces/BaseTransporter';
import { NestMail } from '../../../interfaces/NestMail';
import { NestMailError } from '../../../exceptions/NestMailError';
import { QueueAdapter } from '../../../interfaces/QueueAdapter';

export class NodemailerTransporter implements BaseTransporter {
  constructor(
    public readonly nodemailer: any,
    public readonly queueAdapter: QueueAdapter | undefined,
  ) {}

  async send(mail: NestMail): Promise<void> {
    try {
      await this.nodemailer.sendMail(mail);
    } catch (error) {
      throw new NestMailError('Failed to send email with nodemailer', error);
    }
  }

  async queue(mails: NestMail[]): Promise<void> {
    if (!this.queueAdapter) {
      console.warn(
        'No queue adapter is defined! sending all mails in sync. Long queue will puase the process',
      );
      for (const mail of mails) {
        await this.send(mail);
      }
    } else {
      await this.queueAdapter.queue(mails);
    }
  }
}
