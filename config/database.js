/**
 * Database configuration
 * Note: This is a placeholder. In production, implement actual database connection
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set, skipping database connection');
    return;
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
