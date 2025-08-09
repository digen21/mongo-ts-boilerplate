import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import { env } from '../config';
import { logger } from '../middlewares';
import { User } from '../models';
import { CommonService, sendMail } from '../services';
import { IUser, MailTemplates } from '../types';
import { catchAsync, generateRandomToken } from '../utils';

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

  const userExists = await commonService.findOne({ $or: [{ email }, { username }] });
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

  logger.info(`New user registered: ${newUser.id}`);
  logger.info(`Sending verification email to ${newUser.email}`);

  const encodedToken = encodeURIComponent(generateRandomToken());

  newUser.emailVerificationToken = encodedToken;
  newUser.verificationTokenSentAt = new Date();

  await commonService.update(newUser.id, { emailVerificationToken: encodedToken });

  await sendMail({
    template: MailTemplates.VerificationMail,
    to: email,
    subject: 'Email Verification',
    text: `Welcome ${firstName}, Your account has been created successfully. Please verify your email to complete the registration process.`,
    userId: newUser.id,
    token: encodedToken,
  });

  res
    .status(httpStatus.CREATED)
    .json({ message: 'Verification mail sent successfully.', status: httpStatus.CREATED });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const commonService = new CommonService<IUser>(User);

  let user;
  user = await commonService.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Invalid credentials',
      status: httpStatus.BAD_REQUEST,
    });
  }

  const isValid = await bcrypt.compare(password, user.password!);

  if (!isValid) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Invalid credentials',
      status: httpStatus.UNAUTHORIZED,
    });
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

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { id, token } = req.query;
  const decodedToken = decodeURIComponent(token as string);

  if (!token) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Verification token is required', status: httpStatus.BAD_REQUEST });
  }
  const commonService = new CommonService<IUser>(User);
  const user = await commonService.findOne({
    $and: [{ _id: id }, { emailVerificationToken: decodedToken }],
  });

  if (!user) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'User not found', status: httpStatus.NOT_FOUND });
  }

  if (user.verificationTokenSentAt) {
    const tokenAge = new Date().getTime() - new Date(user.verificationTokenSentAt).getTime();
    const tokenValidityPeriod = 1 * 60 * 1000; // 30 minutes in milliseconds

    if (tokenAge > tokenValidityPeriod) {
      return res
        .status(httpStatus.GONE)
        .json({ message: 'Verification token expired', status: httpStatus.GONE });
    }
  }

  if (user.isEmailVerified) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Email already verified', status: httpStatus.BAD_REQUEST });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.verificationTokenSentAt = null;
  await commonService.update(user.id, { isEmailVerified: true });

  return res.status(httpStatus.OK).json({
    message: 'Email verified successfully',
    status: httpStatus.OK,
    user,
  });
});
