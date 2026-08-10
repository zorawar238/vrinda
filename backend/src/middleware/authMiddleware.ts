import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { User, type IUser } from '../models/User.js';

interface JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.cookies.jwt) {
    try {
      token = req.cookies.jwt;

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
      }

      const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as unknown as JwtPayload;

      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
