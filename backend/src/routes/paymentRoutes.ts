import express from 'express';
import type { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import Razorpay from 'razorpay';
import { protect, type AuthRequest } from '../middleware/authMiddleware.js';
import { Order } from '../models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/razorpay-key', (req: Request, res: Response) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    throw new Error('RAZORPAY_KEY_ID is missing');
  }
  res.send({ keyId: process.env.RAZORPAY_KEY_ID });
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many payment requests, please try again later',
});

router.post('/razorpay-order', protect, paymentLimiter, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys are missing');
    }

    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (order.user.toString() !== req.user?._id?.toString()) {
      res.status(401).json({ message: 'Not authorized to pay for this order' });
      return;
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(order.totalPrice * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${order._id}`,
    };

    const razorpayOrder = await instance.orders.create(options);

    res.json(razorpayOrder);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error creating Razorpay order' });
  }
});

export default router;
