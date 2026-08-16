import type { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const escapeRegex = (text: string) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const pageSize = 12; // 12 items per page
    const page = Number(req.query.page) || 1;

    const searchStr = req.query.search ? String(req.query.search) : '';
    // Limit search string length to prevent regex DOS
    const safeSearchStr = searchStr.substring(0, 100);

    const keyword = safeSearchStr
      ? {
          name: {
            $regex: escapeRegex(safeSearchStr),
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    let sortOption = {};
    if (req.query.sort === 'priceAsc') {
      sortOption = { price: 1 };
    } else if (req.query.sort === 'priceDesc') {
      sortOption = { price: -1 };
    } else if (req.query.sort === 'best') {
      sortOption = { rating: -1, numReviews: -1 };
    } else {
      // Default: sort by newest
      sortOption = { createdAt: -1 };
    }

    const count = await Product.countDocuments({ ...keyword, ...category } as any);
    const products = await Product.find({ ...keyword, ...category } as any)
      .sort(sortOption as any)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error: any) {
    console.error(`Error fetching products: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.find().distinct('category');
    res.json(categories);
  } catch (error: any) {
    console.error(`Error fetching categories: ${error.message}`);
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

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const relatedProducts = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
      }).limit(4);

      res.json(relatedProducts);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    console.error(`Error fetching related products: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
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
      images: [],
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
      images,
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
      product.images = images || product.images;
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

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user?._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ message: 'Product already reviewed' });
        return;
      }

      const review = {
        name: req.user?.name || 'Unknown',
        rating: Number(rating),
        comment,
        user: req.user?._id,
      };

      // @ts-ignore - mongoose typing issue with pushed subdocuments
      product.reviews.push(review);

      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    console.error(`Error adding review: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};
