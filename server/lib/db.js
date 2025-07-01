import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

//function to connect to the MONGODB database
export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}chit-chat-app`);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit the process with failure
  }
}