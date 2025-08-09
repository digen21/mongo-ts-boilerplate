import nodemailer from 'nodemailer';

import { logger } from '../middlewares';
import env from './envVariables';

let transporter: nodemailer.Transporter;

// Check environment
if (env.nodeEnv === 'development') {
  // 📩 Ethereal test account
  const createEtherealAccount = async () => {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: env.smtpHost || 'smtp.ethereal.email',
      port: env.smtpPort || 587,
      secure: false,
      auth: {
        user: env.smtpUser || testAccount.user,
        pass: env.smtpPass || testAccount.pass,
      },
    });

    logger.info('✅ Using Ethereal SMTP for development');
    logger.info(`🔗 Preview URL will be shown in console after sending`);
  };

  // Ethereal account is async, so we must initialize it
  createEtherealAccount();
} else {
  // 📩 Production SMTP (e.g., Gmail)
  transporter = nodemailer.createTransport({
    host: env.smtpHost, // e.g., smtp.gmail.com
    port: env.smtpPort || 587,
    secure: env.smtpPort === 465, // true for port 465
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  logger.info('✅ Using Production SMTP');
}

export { transporter };
