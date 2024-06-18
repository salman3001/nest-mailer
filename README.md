# Mails module for Nest Js

#### This mailing module simplifies sending and queueing emails in nestjs. Support for multiple email and queue adapters.

### Email adapters currently supported

- nodemailer
- sendgrid
- more may be added in future

### Queue adapters currently supported

- Kafka
- bullmq
- more may be added in future

### Instructions

- Install package

```typescript
npm i @salman3001/nest-mailer
```

- insatll a mail adapter you would like to use. currently supported adapters are nodemailer and sendgrid

```typescript
npm install nodemailer
or
npm i @sendgrid/mail
```

- register the mailMoule in root module of your nest app

```typescript
imports: [
  MailModule.register({
    transporter: 'nodemailer', //<-- transporter name
    options: {
      host: 'you host',
      port: 1234,
      secure: false,
      auth: {
        user: 'your username',
        pass: 'your password',
      },
    },
  }),
];
```

- or with rigisterAsync to inject providers. like configservice in below example

```typescript
imports: [
  MailModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transporter: 'nodemailer',
      options: {
        host: config.get<Config>().envs().SMTP_HOST,
        port: config.get<Config>().envs().SMTP_PORT,
        secure: false,
        auth: {
          user: config.get<Config>().envs().SMTP_USERNAME,
          pass: config.get<Config>().envs().SMTP_PASSWORD,
        },
      },
    }),
  }),
];
```

- typescript hints will help you to provide proper config based on mail transporter name specified.
- now create a mail implementing the NestMail as shown below. define your payload and menupulate html or text with setHtml method.
- you may use mailgen or any templating engine to generate emails like handlebars.

```typescript
import { NestMail } from '@salman3001/nest-mailer';

interface ForgorPasswordOtpEmailPayload {
  name: string;
}

export class ForgorPasswordOtpEmail implements NestMail {
  to: string;
  from: string = 'admin@gmail.com';
  subject: string = 'Forgot password';
  text: string;
  html: string;

  setHtml(payload: ForgorPasswordOtpEmailPayload): void {
    this.html = `<h1>Hi ${payload.name}This is a test email</h1>`;
    this.text = `Hi ${payload.name}. This is a test email`;
  }

  constructor(to: string, payload: ForgorPasswordOtpEmailPayload) {
    this.to = to;
    this.setHtml(payload);
  }
}
```

- this module will make MailService provider to be available globaly. you can inject it anywhere and use like shown below..

```typescript
export class UsersService {
  constructor(private readonly mailService: MailService) {}

  async findAll() {
    // send one email synchronously
    await this.mailService.send(
      new ForgorPasswordOtpEmail('salman@gmail.com', { name: 'salman' }),
    );

    //  or queue multiple emails
    await this.mailService.queue([
      new ForgorPasswordOtpEmail('salman@gmail.com', { name: 'salman' }),
      new ForgorPasswordOtpEmail('salman@gmail.com', { name: 'salman' }),
    ]);
  }
}
```

- you can send email in real time by using send method or queue multiple emails. to use queue method. a queue adapter should be defined. if no queue adapter is defined it will send all mails in sync, same as send method. which is helpfull in development as we dont need to setup queue system just yet. to define a queue adapter add below options to mail module.

```typescript
imports: [
  MailModule.register({
    transporter: 'nodemailer', //<-- transporter name
    options: {
      //... transporter options
    },
    queueAdapter: {
      name: 'Kafkajs' | 'bullmq' //<-- queue adapter name
      options: { }//<-- queue adapter options

    },
  }),
];
```

- also install the queue adapter

```typescript
npm install kafkajs
npm install bullmq
// or others once avaialable

```

- select a queue adapter and provide related config. typescript will help.
- if you choose kafka and provide kafka options. mail queue will produce message 'send-email'. you have to setup consumer your self and send the actual email. check kafkajs docs.
- if you choose bullmq and provide bullmq options. mail queue will create job 'new-email' in 'email-queue' queue. you have to setup a bullmq worker that will process jobs from this queue. check bullmq docs.
