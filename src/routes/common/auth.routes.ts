import express from 'express';
import passport from 'passport';

import {
  getRefreshToken,
  googleAuthFailure,
  googleAuthSuccess,
  login,
  profile,
  register,
} from '../../controllers';
import { validateInput } from '../../middlewares';
import { loginSchema, refreshTokenSchema, registerSchema } from '../../validators';

const router = express.Router();

// User registration
router.post('/register', validateInput(registerSchema), register);

// User login
router.post('/login', validateInput(loginSchema), login);

// Get Refresh token
router.post('/refresh-token', validateInput(refreshTokenSchema), getRefreshToken);

// User profile
// This route is protected by JWT authentication
router.get('/profile', passport.authenticate('jwt', { session: false }), profile);

// Google authentication routes

/**
 * Initiate Google authentication
 * This route will redirect the user to Google's OAuth 2.0 server
 * where they can log in and authorize your app
 * The 'scope' parameter specifies the access you want from the user
 * In this case, we are requesting access to the user's profile and email
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/** Google authentication callback
 * This route is called after Google redirects back to your app
 * It will handle the success or failure of the authentication
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleAuthSuccess,
);

/**  Google authentication failure
 * This route is called when the authentication fails
 * It will return an unauthorized status with a failure message
 */
router.get('/google/failure', googleAuthFailure);

export default router;
