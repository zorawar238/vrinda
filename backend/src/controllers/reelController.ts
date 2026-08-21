import { type Request, type Response } from 'express';
import { Reel } from '../models/Reel.js';

// @desc    Get all published reels
// @route   GET /api/reels
// @access  Public
export const getReels = async (req: Request, res: Response) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  try {
    const count = await Reel.countDocuments({ isPublished: true });
    const reels = await Reel.find({ isPublished: true })
      .populate('product', 'name price image images isTrending')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
      
    res.json({ reels, page, pages: Math.ceil(count / pageSize) });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all reels (including unpublished)
// @route   GET /api/reels/all
// @access  Private/Admin
export const getAllReels = async (req: Request, res: Response) => {
  try {
    const reels = await Reel.find({})
      .populate('product', 'name price')
      .sort({ createdAt: -1 });
    res.json(reels);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get reel by ID
// @route   GET /api/reels/:id
// @access  Public
export const getReelById = async (req: Request, res: Response) => {
  try {
    const reel = await Reel.findById(req.params.id).populate('product', 'name price image images isTrending');
    if (reel) {
      res.json(reel);
    } else {
      res.status(404).json({ message: 'Reel not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a reel
// @route   POST /api/reels
// @access  Private/Admin
export const createReel = async (req: Request, res: Response) => {
  const { videoUrl, thumbnailUrl, caption, product, isPublished } = req.body;

  try {
    const reel = new Reel({
      videoUrl,
      thumbnailUrl,
      caption,
      product: product || undefined,
      isPublished: isPublished || false,
    });

    const createdReel = await reel.save();
    res.status(201).json(createdReel);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid reel data' });
  }
};

// @desc    Update a reel
// @route   PUT /api/reels/:id
// @access  Private/Admin
export const updateReel = async (req: Request, res: Response) => {
  const { videoUrl, thumbnailUrl, caption, product, isPublished } = req.body;

  try {
    const reel = await Reel.findById(req.params.id);

    if (reel) {
      reel.videoUrl = videoUrl || reel.videoUrl;
      reel.thumbnailUrl = thumbnailUrl || reel.thumbnailUrl;
      reel.caption = caption !== undefined ? caption : reel.caption;
      reel.product = product !== undefined ? (product === '' ? undefined : product) : reel.product;
      reel.isPublished = isPublished !== undefined ? isPublished : reel.isPublished;

      const updatedReel = await reel.save();
      res.json(updatedReel);
    } else {
      res.status(404).json({ message: 'Reel not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid reel data' });
  }
};

// @desc    Delete a reel
// @route   DELETE /api/reels/:id
// @access  Private/Admin
export const deleteReel = async (req: Request, res: Response) => {
  try {
    const reel = await Reel.findById(req.params.id);

    if (reel) {
      await reel.deleteOne();
      res.json({ message: 'Reel removed' });
    } else {
      res.status(404).json({ message: 'Reel not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
