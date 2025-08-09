import mongoose from 'mongoose';

import { logger } from '../middlewares';
import env from './envVariables';

const connectDB = () => {
  mongoose
    .connect(env.mongodbUri)
    .then(() => {
      logger.info('Connected to MongoDB');
    })
    .catch((err) => {
      logger.error('MongoDB connection error:', err);
      process.exit(1);
    });
};

export default connectDB;
