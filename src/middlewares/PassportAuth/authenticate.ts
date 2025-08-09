import { NextFunction, Request, RequestHandler, Response } from 'express';
import passport from 'passport';

const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false })(req, res, next);
};

export default authenticate;
