import { BaseTransporter } from '../../../interfaces/BaseTransporter';
import { MailService } from '@sendgrid/mail';
import { NestMail } from '../../../interfaces/NestMail';
import { NestMailError } from '../../../exceptions/NestMailError';
import { QueueAdapter } from '../../../interfaces/QueueAdapter';

export class SendgridTransporter implements BaseTransporter {
  constructor(
    public readonly mailer: MailService,
    public readonly queueAdapter: QueueAdapter | undefined,
  ) {}

  async send(mail: NestMail): Promise<void> {
    try {
      await this.mailer.send(mail);
    } catch (error) {
      throw new NestMailError('failed to send email with send grid', error);
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
