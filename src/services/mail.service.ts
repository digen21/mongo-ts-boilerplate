import fs from 'fs';
import path from 'path';

import { env, transporter } from '../config';
import { logger } from '../middlewares';
import { SendMailOptions } from '../types';

export const sendMail = async ({ to, subject, template, text, token, userId }: SendMailOptions) => {
  try {
    let templatePath = path.join(__dirname, '../templates', `${template}.html`);
    let emailHtml = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders with real values
    emailHtml = emailHtml.replace('{id}', userId).replace('{token}', token);

    const info = await transporter.sendMail({
      from: env.smtpFromEmail, // Sender address
      to,
      subject,
      text,
      html: emailHtml,
    });

    logger.info('Email sent:', info.messageId);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};
