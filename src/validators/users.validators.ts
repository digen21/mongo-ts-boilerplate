import Joi from 'joi';

import { IUserLogin, IUserRegister } from '../types';

export const loginSchema = Joi.object<IUserLogin>({
  username: Joi.string().trim().min(3).optional(),
  email: Joi.string().trim().lowercase().email().optional(),
  password: Joi.string().min(6).required(),
}).custom((value, helpers) => {
  // Require either username or email
  if (!value.username && !value.email) {
    return helpers.error('any.custom', { message: 'Either username or email is required' });
  }
  return value;
}, 'Username or Email requirement');

// Optional: Registration validator
export const registerSchema = Joi.object<IUserRegister>({
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  username: Joi.string().trim().min(3).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
}).required();
