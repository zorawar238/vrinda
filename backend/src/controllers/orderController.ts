import type { Response } from 'express';
import { Order } from '../models/Order.js';
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
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      const order = new Order({
        orderItems: orderItems.map((x: any) => ({
          ...x,
          product: x._id,
          _id: undefined,
        })),
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
    const orders = await Order.find({ user: req.user?._id });
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

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();

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
