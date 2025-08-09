import Joi from 'joi';
import 'dotenv/config';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().uri().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
  SESSION_SECRET: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  SMTP_FROM_NAME: Joi.string(),
  SMTP_FROM_EMAIL: Joi.string().email(),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const env = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  mongodbUri: envVars.MONGODB_URI,
  googleClientId: envVars.GOOGLE_CLIENT_ID,
  googleClientSecret: envVars.GOOGLE_CLIENT_SECRET,
  sessionSecret: envVars.SESSION_SECRET,
  callbackUrl: envVars.GOOGLE_CALLBACK_URL,
  isProduction: envVars.NODE_ENV === 'production',
  isDevelopment: envVars.NODE_ENV === 'development',
  jwtSecret: envVars.JWT_SECRET,
  smtpHost: envVars.SMTP_HOST,
  smtpPort: envVars.SMTP_PORT,
  smtpUser: envVars.SMTP_USER,
  smtpPass: envVars.SMTP_PASS,
  smtpFromName: envVars.SMTP_FROM_NAME || 'Trackify',
  smtpFromEmail: envVars.SMTP_FROM_EMAIL || 'no-reply@trackify',
};

export default env;
