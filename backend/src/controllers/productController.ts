import type { Request, Response } from 'express';
import { Product } from '../models/Product';
import type { AuthRequest } from '../middleware/authMiddleware.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error: any) {
    console.error(`Error fetching products: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    console.error(`Error fetching product: ${error.message}`);
    // If the ID isn't a valid MongoDB ObjectId, it will throw an error here
    res.status(404).json({ message: 'Product not found or invalid ID' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = new Product({
      name: 'Sample name',
      price: 0,
      user: req.user?._id || null, // Assuming you might link product to admin user
      image: 'https://via.placeholder.com/400x500',
      category: 'Sample category',
      stock: 0,
      description: 'Sample description',
      sizes: ['S', 'M', 'L'],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    console.error(`Error creating product: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
      stock,
      sizes,
      isTrending,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.category = category;
      product.stock = stock;
      product.sizes = sizes;
      product.isTrending = isTrending;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    console.error(`Error updating product: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    console.error(`Error deleting product: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};
