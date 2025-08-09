import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Wraps an asynchronous function (route handler) to catch any errors that occur and
 * pass them to the `next` middleware. This avoids the need for repetitive try-catch
 * blocks in every async route handler.
 *
 * @param fn The asynchronous function (Express.js route handler) to wrap.
 * It typically takes `req`, `res`, and `next` as arguments and returns a Promise.
 * @returns A new middleware function that executes the original async function,
 * handles any rejections from its Promise, and forwards them to the `next` middleware.
 */
const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default catchAsync;
