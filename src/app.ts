import httpStatus from 'http-status';
import express from 'express';
import { logger } from './middlewares';
import { connectDB } from './config';
import { env } from 'process';

// Create an Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// API call logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// mongodb database connection
connectDB();

// Health check route
app.get('/health', (_req, res) => {
  return res.status(httpStatus.OK).send({ status: httpStatus.OK, message: 'Server is healthy' });
});

app.listen(env.port, () => {});
