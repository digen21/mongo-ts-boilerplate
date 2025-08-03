import httpStatus from 'http-status';

export default class ServerError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    statusCode: number = httpStatus.INTERNAL_SERVER_ERROR,
    message: string = '',
    isOperational = true,
    stack = '',
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
