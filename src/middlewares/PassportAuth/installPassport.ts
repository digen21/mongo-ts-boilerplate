import { Express } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { User } from '../../models';
import { CommonService } from '../../services';
import { IUser } from '../../types';
import { ServerError } from '../../utils';

interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
}

export default (app: Express) => {
  const options = {
    secretOrKey: String(process.env.JWT_SECRET),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const commonService = new CommonService<IUser>(User);

  passport.use(
    new Strategy(options, async (payload: JWTPayload, done: VerifiedCallback) => {
      const user = await commonService.findOne({ _id: payload.userId });

      if (user && !user.isEmailVerified) {
        throw new ServerError({
          message: 'Your account is not verified',
          status: httpStatus.FORBIDDEN,
        });
      }

      return done(null, user || false);
    }),
  );

  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    const user = await commonService.findOne({ _id: id });
    done(null, user);
  });

  app.use(passport.initialize());
};
