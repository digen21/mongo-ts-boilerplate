import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Schema } from 'joi';

import { ServerError } from '../utils';
import logger from './logger';

const validateInput = (schema: Schema) => async (req: Request, _: Response, next: NextFunction) => {
  const reqBody = {
    ...req.body,
    ...req.query,
    ...req.params,
  };

  const { error } = schema.validate(reqBody);

  if (error && error.details) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    logger.error('Validation Error', {
      error: errorMessage,
    });
    return next(
      new ServerError({
        message: errorMessage,
        status: httpStatus.BAD_REQUEST,
      }),
    );
  }

  if (error) {
    if (error instanceof ServerError) return next(error);
    else {
      logger.error('Validate Schema Error', {
        error,
      });

      return next(
        new ServerError({
          message: 'Something went wrong',
          status: httpStatus.INTERNAL_SERVER_ERROR,
        }),
      );
    }
  }

  next();
};

export default validateInput;
