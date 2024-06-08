import { Inject, Injectable } from '@nestjs/common';
import { NEST_MAIL_TRANSPORTER } from './constants/NEST_MAIL_TRANSPORTER';
import { BaseTransporter } from './interfaces/BaseTransporter';
import { NestMail } from './interfaces/NestMail';

@Injectable()
export class MailService {
  constructor(
    @Inject(NEST_MAIL_TRANSPORTER) private readonly transport: BaseTransporter,
  ) {}

  async send(mail: NestMail) {
    await this.transport.send(mail);
  }

  async queue(mails: NestMail[]) {
    await this.transport.queue(mails);
  }
}
