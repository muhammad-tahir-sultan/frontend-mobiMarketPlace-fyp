/**
 * Combined Mobile Data Generation and Import Script
 * 
 * This script handles both the generation and import of mobile data in one step.
 * It first checks for dependencies, installs them if needed, then generates
 * the mobile data and imports it into MongoDB.
 * 
 * Usage: 
 * node generate-and-import.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create require function
const require = createRequire(import.meta.url);

// Check if a package is installed
function isPackageInstalled(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (e) {
    return false;
  }
}

// Main function
async function generateAndImport() {
  console.log('=== MobiCommerce Mobile Data Generator and Importer ===\n');
  
  // Check and install dependencies
  const requiredPackages = ['mongoose', 'dotenv'];
  const missingPackages = requiredPackages.filter(pkg => !isPackageInstalled(pkg));
  
  if (missingPackages.length > 0) {
    console.log(`Installing required dependencies: ${missingPackages.join(', ')}...`);
    try {
      execSync(`npm install ${missingPackages.join(' ')}`, { stdio: 'inherit' });
      console.log('Dependencies installed successfully!\n');
    } catch (error) {
      console.error('Failed to install dependencies. Please install them manually:');
      console.error(`npm install ${missingPackages.join(' ')}`);
      process.exit(1);
    }
  }
  
  // Step 1: Generate mobile data
  console.log('Step 1: Generating mobile data...');
  try {
    // Create the scripts/output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    
    // Run the generation script using a dynamic import
    console.log('Running data generation script...');
    const generateModule = await import('./generate-mobile-data.js');
    
    // Wait for the data to be generated
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    console.error('Error generating mobile data:', error.message);
    process.exit(1);
  }
  
  // Step 2: Import to MongoDB
  console.log('\nStep 2: Importing data into MongoDB...');
  console.log('Note: This step will connect to your MongoDB database.');
  console.log('Press Enter to continue or Ctrl+C to abort...');
  
  // Wait for user confirmation
  await new Promise(resolve => {
    process.stdin.once('data', () => {
      resolve();
    });
  });
  
  try {
    // Run the import script using a dynamic import
    const importModule = await import('./import-mobile-data.js');
  } catch (error) {
    console.error('Error importing data:', error.message);
    process.exit(1);
  }
}

// Run the main function
generateAndImport(); 