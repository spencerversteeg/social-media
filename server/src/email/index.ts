import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { inDevelopment } from '../utils';
import EmailData from '../@types/EmailData';

const emailTemplate = (template: string): string =>
  fs.readFileSync(path.resolve(__dirname, `./templates/${template}.html`), 'utf8').toString();

const prepareTemplate = (templateData: EmailData) => {
  if (!templateData || !templateData.template) {
    throw new Error('Invalid template data');
  }

  const template = emailTemplate(templateData.template);
  if (!template) throw new Error('Invalid template');

  // @ts-ignore
  const subject = template.match(/<title>(.*?)<\/title>/g).map((title: string) => {
    return title.replace(/<\/?title>/g, '');
  });

  if (!subject) throw new Error('There was no subject title set.');

  // Parse the handlebars template and add in the normal fields
  const handlebarsHtml = handlebars.compile(template);
  const html = handlebarsHtml(templateData);

  return {
    to: templateData.to,
    subject: subject[0],
    html
  };
};

const productionData: unknown = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: !inDevelopment,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

const developmentData = (user: string, pass: string) => {
  return {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: !inDevelopment,
    auth: {
      user,
      pass
    }
  };
};

const emailService = async () => {
  // TODO: Fix this Type error
  // @ts-ignore
  if (!inDevelopment) return nodemailer.createTransport(productionData);

  const testAccount = await nodemailer.createTestAccount();
  return await nodemailer.createTransport(developmentData(testAccount.user, testAccount.pass));
};

// Use this function to send emails.
export const sendEmail = async (data: EmailData) => {
  try {
    if (!data) return console.error('There was no email data provided.');
    const mailer = await emailService();

    // Send the mail
    const sentMail = await mailer.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.SMTP_EMAIL}>`,
      ...prepareTemplate(data)
    });

    // If you are in development mode,
    // Logs will be sent to the console with a message ID and preview URL.
    if (inDevelopment) {
      console.log(`Message sent: ${sentMail.messageId}`);
      console.log(`Development Preview Email: ${nodemailer.getTestMessageUrl(sentMail)}`);
    }
  } catch (error) {
    console.error(error);
  }
};
