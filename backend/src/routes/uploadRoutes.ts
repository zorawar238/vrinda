import express, { type Request, type Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { protect, admin } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'vrinda_products',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      format: 'webp', // Force format to webp for massive speed gains
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post('/', protect, admin, upload.single('image'), (req: Request, res: Response) => {
  if (req.file) {
    res.send({
      message: 'Image Uploaded',
      image: req.file.path, // Cloudinary URL
    });
  } else {
    res.status(400).send({ message: 'No image provided' });
  }
});

router.post('/multiple', protect, admin, upload.array('images', 10), (req: Request, res: Response) => {
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const images = req.files.map((file: any) => file.path);
    res.send({
      message: 'Images Uploaded',
      images,
    });
  } else {
    res.status(400).send({ message: 'No images provided' });
  }
});

export default router;
