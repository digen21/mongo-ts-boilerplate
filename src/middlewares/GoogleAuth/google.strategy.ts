import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { env } from '@src/config';
import { User } from '@src/models';
import { CommonService, findOrCreateGoogleUser } from '@src/services';
import { IUser } from '@src/types';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId!,
      clientSecret: env.googleClientSecret!,
      callbackURL: '/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await findOrCreateGoogleUser(profile);
        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const commonService = new CommonService<IUser>(User);
  const user = commonService.findById(id);
  done(null, user);
});
