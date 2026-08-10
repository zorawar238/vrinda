import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  addWishlistItem,
  removeWishlistItem,
  syncWishlist,
  forgotPassword,
  resetPassword,
  logoutUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again after 15 minutes',
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many password reset requests, please try again after an hour',
});

router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

router.post('/login', authLimiter, authUser);
router.post('/logout', logoutUser);
router.post('/forgotpassword', passwordResetLimiter, forgotPassword);
router.put('/resetpassword/:token', passwordResetLimiter, resetPassword);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/wishlist')
  .post(protect, addWishlistItem)
  .put(protect, syncWishlist);

router.route('/wishlist/:productId')
  .delete(protect, removeWishlistItem);

router.route('/:id')
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

export default router;
