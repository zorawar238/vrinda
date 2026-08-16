import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  name: string;
  rating: number;
  comment: string;
  user: mongoose.Types.ObjectId;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  stock: number;
  image: string;
  images: string[];
  isTrending?: boolean;
  reviews: IReview[];
  rating: number;
  numReviews: number;
}

const reviewSchema = new Schema<IReview>(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
    },
    sizes: {
      type: [String],
      required: true,
      default: ['XS', 'S', 'M', 'L', 'XL'],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
