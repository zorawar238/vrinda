import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/User.js';

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to DB...');

    // Make all current users admins for testing purposes
    const result = await User.updateMany({}, { isAdmin: true });
    
    console.log(`Successfully promoted ${result.modifiedCount} user(s) to Admin!`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

makeAdmin();
