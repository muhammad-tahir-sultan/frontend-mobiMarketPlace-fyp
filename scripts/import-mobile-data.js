/**
 * Mobile Phone Data Import Script
 * 
 * This script imports the generated mobile phones data into MongoDB.
 * It reads the JSON file created by generate-mobile-data.js and
 * inserts the data into your MongoDB database.
 * 
 * Usage: 
 * node import-mobile-data.js
 */

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../backend/.env') });

// MongoDB connection string (uses the one from your backend .env file)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mobicommerce';

// Define a product schema that matches your existing schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    lowercase: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
  specifications: {
    type: mongoose.Schema.Types.Mixed,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
}, { timestamps: true });

// Create model
const Product = mongoose.model('Product', productSchema);

// Main function
async function importData() {
  console.log('Connecting to MongoDB...');
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully!');
    
    // Read the JSON file
    const dataPath = path.join(__dirname, 'output', 'mobile-products.json');
    if (!fs.existsSync(dataPath)) {
      console.error('Error: Data file not found. Please run generate-mobile-data.js first.');
      process.exit(1);
    }
    
    const mobileData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`Found ${mobileData.length} mobile products in the data file.`);
    
    // Check if products already exist
    const existingCount = await Product.countDocuments({ category: 'mobile' });
    if (existingCount > 0) {
      console.log(`Warning: You already have ${existingCount} mobile products in the database.`);
      console.log('Do you want to proceed with import? This may create duplicates.');
      console.log('To continue, press Enter. To abort, press Ctrl+C');
      
      // Wait for user confirmation
      await new Promise(resolve => {
        process.stdin.once('data', () => {
          resolve();
        });
      });
    }
    
    // Insert data
    console.log('Importing data into MongoDB...');
    const result = await Product.insertMany(mobileData);
    
    console.log(`Success! Imported ${result.length} mobile products into the database.`);
    console.log('Products are now available in your MongoDB collection.');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 11000) {
      console.error('Duplicate key error. Some products might already exist in the database.');
    }
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the import function
importData(); 