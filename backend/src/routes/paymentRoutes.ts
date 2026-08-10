import express from 'express';
import type { Request, Response } from 'express';
import Razorpay from 'razorpay';
import { protect } from '../middleware/authMiddleware.js';
import { Order } from '../models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/razorpay-key', (req: Request, res: Response) => {
  res.send({ keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey' });
});

router.post('/razorpay-order', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'mockSecret',
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
