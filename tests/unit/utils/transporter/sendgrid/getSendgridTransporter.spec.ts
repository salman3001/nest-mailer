import { SendgridTransporter } from '../../../../../src/utils/transporters/sendgrid/SendgridTransporter';
import { getSendgridTransport } from '../../../../../src/utils/transporters/sendgrid/getSendgridTransporter';
import sgMail from '@sendgrid/mail';

describe('get nodemailer', () => {
  test('it should be defined', () => {
    expect(SendgridTransporter).toBeDefined();
  });

  test('it return transporter', async () => {
    jest.spyOn(sgMail, 'setApiKey').mockImplementationOnce(jest.fn());
    const results = await getSendgridTransport({ apiKey: 'SG.skjdkjdsk' });
    console.log(results);

    expect(sgMail.setApiKey).toHaveBeenCalled();
    expect(results).toBeInstanceOf(SendgridTransporter);
  });
});
