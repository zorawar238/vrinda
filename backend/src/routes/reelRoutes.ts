import express from 'express';
import {
  getReels,
  getAllReels,
  getReelById,
  createReel,
  updateReel,
  deleteReel,
} from '../controllers/reelController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getReels).post(protect, admin, createReel);
router.route('/all').get(protect, admin, getAllReels);
router
  .route('/:id')
  .get(getReelById)
  .put(protect, admin, updateReel)
  .delete(protect, admin, deleteReel);

export default router;
