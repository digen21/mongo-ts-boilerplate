import express from 'express';
import { googleAuthFailure, googleAuthSuccess } from "../../controllers";
import passport from 'passport';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleAuthSuccess,
);

router.get('/google/failure', googleAuthFailure);   

export default router;
