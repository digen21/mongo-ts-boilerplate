import { Document } from 'mongoose';

export type LoginType = 'manual' | 'google';

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  loginThrough: LoginType;
  lastLoginAt?: Date;
}
