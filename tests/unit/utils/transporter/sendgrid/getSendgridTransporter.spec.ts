import { SendgridTransporter } from '../../../../../src/utils/transporters/sendgrid/SendgridTransporter';
import { getSendgridTransport } from '../../../../../src/utils/transporters/sendgrid/getSendgridTransporter';
import * as sgMail from '@sendgrid/mail';
jest.mock('@sendgrid/mail', () => ({
  __esModule: true,
  setApiKey: jest.fn(),
}));

describe('get nodemailer', () => {
  test('it should be defined', () => {
    expect(SendgridTransporter).toBeDefined();
  });

  test('it return transporter', () => {
    const results = getSendgridTransport({ apiKey: 'any key' });
    expect(sgMail.setApiKey).toHaveBeenCalled();
    expect(results).toBeInstanceOf(SendgridTransporter);
  });
});
