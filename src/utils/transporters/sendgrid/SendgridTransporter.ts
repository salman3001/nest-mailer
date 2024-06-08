import { BaseTransporter } from '../../../interfaces/BaseTransporter';
import { MailService } from '@sendgrid/mail';
import { NestMail } from '../../../interfaces/NestMail';
import { NestMailError } from '../../../exceptions/NestMailError';
import { QueueAdapter } from '../../../interfaces/QueueAdapter';

export class SendgridTransporter implements BaseTransporter {
  constructor(
    private readonly transporter: MailService,
    private readonly queueAdapter: QueueAdapter | undefined,
  ) {}

  async send(mail: NestMail): Promise<void> {
    try {
      await this.transporter.send(mail);
    } catch (error) {
      throw new NestMailError('failed to send email with send grid', error);
    }
  }

  async queue(mails: NestMail[]): Promise<void> {
    if (!this.queueAdapter) {
      throw new NestMailError('No Queue adapter is defined');
    }
    await this.queueAdapter.queue(mails);
  }
}
