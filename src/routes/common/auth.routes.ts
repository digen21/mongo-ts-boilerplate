import express from 'express';
import passport from 'passport';

import { googleAuthFailure, googleAuthSuccess } from '@src/controllers';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/failure', session: false }),
  googleAuthSuccess,
);

router.get('/google/failure', googleAuthFailure);

export default router;
