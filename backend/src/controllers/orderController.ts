import type { Response } from 'express';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      // Calculate prices securely on the server and validate qty/size/stock
      const dbOrderItems = await Promise.all(
        orderItems.map(async (clientItem: any) => {
          const product = await Product.findById(clientItem._id || clientItem.product);
          if (!product) throw new Error(`Product not found`);
          
          const qty = Number(clientItem.qty);
          if (!Number.isInteger(qty) || qty <= 0) {
            throw new Error(`Invalid quantity for ${product.name}`);
          }
          if (qty > product.stock) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
          if (!product.sizes.includes(clientItem.size)) {
            throw new Error(`Invalid size for ${product.name}`);
          }

          return {
            name: product.name,
            qty,
            image: product.image,
            price: product.price,
            product: product._id,
            size: clientItem.size,
          };
        })
      );

      const itemsPrice = dbOrderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      const shippingPrice = itemsPrice > 500 ? 0 : 50;
      const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
      const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

      const order = new Order({
        orderItems: dbOrderItems,
        user: req.user?._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?._id as any });
    res.json(orders);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Check if order belongs to user or user is admin
      if (order.user._id.toString() !== req.user?._id.toString() && !req.user?.isAdmin) {
         res.status(401).json({ message: 'Not authorized to view this order' });
         return;
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

import crypto from 'crypto';
import Razorpay from 'razorpay';

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const payOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error('RAZORPAY_KEY_SECRET is missing');
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      res.status(400).json({ message: 'Invalid payment signature' });
      return;
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.user.toString() !== req.user?._id?.toString()) {
        res.status(401).json({ message: 'Not authorized to pay for this order' });
        return;
      }

      // Verify the Razorpay order matches this DB order
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID as string,
        key_secret: secret,
      });

      const rzpOrder = await instance.orders.fetch(razorpay_order_id);
      
      if (rzpOrder.receipt !== `receipt_order_${order._id}`) {
        res.status(400).json({ message: 'Payment receipt mismatch' });
        return;
      }

      const expectedAmount = Math.round(order.totalPrice * 100);
      if (rzpOrder.amount !== expectedAmount) {
        res.status(400).json({ message: 'Payment amount mismatch' });
        return;
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'completed',
        update_time: new Date().toISOString(),
        email_address: req.user?.email || '',
      };

      const updatedOrder = await order.save();

      // Atomically decrement stock
      const bulkOps = order.orderItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { stock: -item.qty } },
        },
      }));
      await Product.bulkWrite(bulkOps);

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get analytics for admin dashboard
// @route   GET /api/orders/analytics
// @access  Private/Admin
export const getAdminAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Sales over time (by date)
    const salesData = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.name',
          qty: { $sum: '$orderItems.qty' },
          revenue: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } },
        },
      },
      { $sort: { qty: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalRevenue,
      salesData: salesData.map((x) => ({ date: x._id, revenue: x.revenue, orders: x.orders })),
      topProducts: topProducts.map((x) => ({ name: x._id, qty: x.qty, revenue: x.revenue })),
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
