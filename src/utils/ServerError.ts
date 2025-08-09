import httpStatus from 'http-status';

class ServerError extends Error {
  public readonly statusCode: HttpStatus | number;
  isOperational: boolean;

  public constructor({
    message,
    status,
    isOperational = true,
    stack = '',
  }: {
    message: string;
    status: HttpStatus | number;
    isOperational?: boolean;
    stack?: string;
  }) {
    super(message);
    this.statusCode = status || httpStatus.INTERNAL_SERVER_ERROR;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ServerError;
