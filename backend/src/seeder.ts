import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Product } from './models/Product.js';
import { User } from './models/User.js';
import { products } from './data/products.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear out existing data to prevent duplicates
    await Product.deleteMany();
    await User.deleteMany();

    // Insert new data
    await Product.insertMany(products);

    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error: any) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log('✅ Data Destroyed Successfully!');
    process.exit();
  } catch (error: any) {
    console.error(`❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
