import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  stock: number;
  image: string;
  isTrending?: boolean;
}

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
    isTrending: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
