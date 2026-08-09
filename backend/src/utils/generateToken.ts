import jwt from 'jsonwebtoken';

export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  
  return jwt.sign({ userId }, secret, {
    expiresIn: '30d',
  });
};
