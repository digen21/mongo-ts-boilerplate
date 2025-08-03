import path from 'path';
import { MESSAGE, SPLAT } from 'triple-beam';
import { createLogger, format, level, transports } from 'winston';

export interface TransformableInfo {
  level: string;
  message: unknown;
  [level]?: string;
  [MESSAGE]?: unknown;
  [SPLAT]?: unknown;
  [key: string | symbol]: unknown;
}

const { combine, timestamp, printf, errors, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }: TransformableInfo) => {
  return `[${timestamp}] ${level}: ${stack || message}`;
});

// Logger instance
const logger = createLogger({
  level: 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), logFormat),
  transports: [
    new transports.File({
      filename: path.join(__dirname, '../../logs/error.logs'),
      level: 'error',
    }),
    new transports.File({
      filename: path.join(__dirname, '../../logs/warning.logs'),
      level: 'warn',
    }),
    new transports.File({
      filename: path.join(__dirname, '../../logs/success.logs'),
      level: 'info',
    }),
    new transports.File({
      filename: path.join(__dirname, '../../logs/untracked.logs'),
      level: 'debug',
    }),
  ],
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
  );
}

export default logger;
