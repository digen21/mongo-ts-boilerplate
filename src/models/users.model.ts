// src/models/UserModel.ts
import { IUser } from '@src/types';
import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema<IUser>(
  {
    /**
     * User's first name
     */
    firstName: { type: String },

    /**
     * User's last name
     */
    lastName: { type: String },

    /**
     * Unique username for the user (required)
     */
    username: { type: String, required: true, unique: true },

    /**
     * Unique email address for the user (required)
     */
    email: { type: String, required: true, unique: true },

    /**
     * Hashed password for the user (required)
     */
    password: { type: String, required: true },

    /**
     * Login method for the user (manual or google, required)
     */
    loginThrough: {
      type: String,
      enum: ['manual', 'google'],
      required: true,
    },

    /**
     * Last login date and time for the user
     */
    lastLoginAt: { type: Date },
  },
  {
    /**
     * Automatically manage createdAt and updatedAt fields
     */
    timestamps: true,
  },
);

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema, 'users');

export default User;
