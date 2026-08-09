import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id as string);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id as string);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        res.status(400).json({ message: 'Cannot delete admin user' });
        return;
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
