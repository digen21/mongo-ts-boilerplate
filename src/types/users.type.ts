import { Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password?: string;
  provider?: string;
  providerId?: string;
  lastLoginAt?: Date;
  imageUrl?: string;
  isEmailVerified?: boolean;
}

export type IUserRegister = Omit<
  IUser,
  'isEmailVerified' | 'lastLoginAt' | 'provider' | 'providerId'
>;
export type IUserLogin = Pick<IUser, 'username' | 'email' | 'password'>;
