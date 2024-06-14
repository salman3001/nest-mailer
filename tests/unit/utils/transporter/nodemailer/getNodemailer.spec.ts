import { NodemailerTransporter } from '../../../../../src/utils/transporters/nodemailer/NodeMailerTransporter';
import { getNodemailerTransport } from '../../../../../src/utils/transporters/nodemailer/getNodemailer';
import { createTransport } from 'nodemailer';
jest.mock('nodemailer', () => ({
  __esModule: true,
  default: undefined,
  createTransport: jest.fn().mockReturnValueOnce(undefined),
}));

describe('get nodemailer', () => {
  test('it should be defined', () => {
    expect(getNodemailerTransport).toBeDefined();
  });

  test('it return transporter', async () => {
    const results = await getNodemailerTransport({});
    expect(createTransport).toHaveBeenCalled();
    expect(results).toBeInstanceOf(NodemailerTransporter);
  });
});
