import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../utils';

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
