import express from 'express';
import session from 'express-session';
import httpStatus from 'http-status';
import passport from 'passport';

import { connectDB, env } from './config';
import { logger } from './middlewares';
import router from './routes';

// Create an Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// API call logger middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// mongodb database connection
connectDB();

// Use express-session middleware to handle user sessions (required for Passport.js authentication)
app.use(session({ secret: env.sessionSecret, resave: false, saveUninitialized: false }));

// Initialize Passport.js middleware for authentication strategies
app.use(passport.initialize());

// Enable persistent login sessions with Passport.js (requires express-session)
app.use(passport.session());

// Health check route
app.get('/health', (_req, res) => {
  return res.status(httpStatus.OK).send({ status: httpStatus.OK, message: 'Server is healthy' });
});

// API gateway route
app.use('/api', router);

// Global error handler middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err.stack || err.message || err);
  const status = err.statusCode || err.status || httpStatus.INTERNAL_SERVER_ERROR;
  res.status(status).json({
    status,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
