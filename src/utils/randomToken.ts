import crypto from 'crypto';

const generateRandomToken = (): string => {
  const token = crypto.randomBytes(32).toString('hex');
  return token;
};

export default generateRandomToken;
