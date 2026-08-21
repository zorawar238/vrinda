import mongoose, { Document, Schema } from 'mongoose';

export interface IReel extends Document {
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  product?: mongoose.Types.ObjectId;
  isPublished: boolean;
  likes: number;
  comments: number;
  shares: number;
}

const reelSchema = new Schema<IReel>(
  {
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    thumbnailUrl: {
      type: String,
    },
    caption: {
      type: String,
      default: '',
    },
    product: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Product',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Reel = mongoose.model<IReel>('Reel', reelSchema);
