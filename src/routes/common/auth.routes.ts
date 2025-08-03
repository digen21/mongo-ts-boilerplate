import express from 'express';

const router = express.Router();

router.post('/login').post('/signup').post('/logout').post('/refresh-token');
