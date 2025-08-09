import { Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import { env } from '../config';
import { User } from '../models';
import { CommonService } from '../services';
import { IUser } from '../types';
import { catchAsync } from '../utils';

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

export const googleAuthSuccess = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'Authentication failed', status: httpStatus.UNAUTHORIZED });
  }
  res.json({ user: req.user, status: httpStatus.OK, message: 'Google authentication successful' });
});

export const googleAuthFailure = catchAsync(async (_req: Request, res: Response) => {
  res
    .status(httpStatus.UNAUTHORIZED)
    .json({ message: 'Google authentication failed', status: httpStatus.UNAUTHORIZED });
});

export const register = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password, firstName, lastName } = req.body;

  const commonService = new CommonService<IUser>(User);

  const userExists = await commonService.find({ $or: [{ email }, { username }] });
  if (userExists) {
    return res.status(httpStatus.CONFLICT).json({
      message: 'Username or email already exists',
      status: httpStatus.CONFLICT,
    });
  }

  const newUser = await commonService.create({
    username,
    email,
    password,
    firstName,
    lastName,
  });

  res
    .status(httpStatus.CREATED)
    .json({ message: 'User registered successfully', status: httpStatus.CREATED, user: newUser });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const commonService = new CommonService<IUser>(User);

  const user = await commonService.findOne({
    $or: [{ username }, { email }],
    password, // Assuming password is hashed and compared in the service
  });

  if (!user) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'Invalid credentials', status: httpStatus.UNAUTHORIZED });
  }

  // Update last login time
  user.lastLoginAt = new Date();
  await commonService.update(user.id, { lastLoginAt: user.lastLoginAt });

  // Generate JWT tokens
  const authToken = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: '1h',
  });

  // Generate refresh token
  const refreshToken = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: '7d',
  });

  return res
    .status(httpStatus.OK)
    .json({ message: 'Login successful', status: httpStatus.OK, authToken, refreshToken, user });
});

export const getRefreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Refresh token is required', status: httpStatus.BAD_REQUEST });
  }

  const decoded = jwt.verify(refreshToken, env.jwtSecret) as { id: string; email: string };
  const commonService = new CommonService<IUser>(User);
  const user = await commonService.findById(decoded.id);

  if (!user) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'Invalid refresh token', status: httpStatus.UNAUTHORIZED });
  }

  // Generate new auth token
  const authToken = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: '1h',
  });

  // Generate refresh token
  const newRefreshToken = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: '7d',
  });

  return res.status(httpStatus.OK).json({
    message: 'New auth token generated',
    status: httpStatus.OK,
    authToken,
    refreshToken: newRefreshToken,
    user,
  });
});


export const profile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'User not authenticated', status: httpStatus.UNAUTHORIZED });
  }

  const commonService = new CommonService<IUser>(User);
  const user = await commonService.findById(req.user.id);

  if (!user) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'User not found', status: httpStatus.NOT_FOUND });
  }

  return res.status(httpStatus.OK).json({
    message: 'User profile retrieved successfully',
    status: httpStatus.OK,
    user,
  });
});