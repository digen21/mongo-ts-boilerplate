import mongoose from 'mongoose';
import env from './envVariables';

const connectDB = () => {
  mongoose
    .connect(env.mongodbUri)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
};

export default connectDB;
