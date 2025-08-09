import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { env } from '../../config';
import { User } from '../../models';
import { CommonService, findOrCreateGoogleUser } from '../../services';
import { IUser } from '../../types';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId!,
      clientSecret: env.googleClientSecret!,
      callbackURL: env.callbackUrl,
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const commonService = new CommonService<IUser>(User);
  const user = await commonService.findById(id);
  done(null, user);
});

export default passport;