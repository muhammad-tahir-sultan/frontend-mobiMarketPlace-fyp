# Mobile Data Generator for MobiCommerce

This folder contains scripts to generate and import sample mobile phone data for your MobiCommerce e-commerce application.

## Available Scripts

### 1. Generate Mobile Data

This script creates a JSON file with data for 30 mobile phones with realistic specifications, prices, and descriptions.

```bash
node generate-mobile-data.js
```

**Output:** The script will create an `output` folder containing `mobile-products.json` file.

### 2. Import Mobile Data to MongoDB

This script imports the generated data into your MongoDB database.

```bash
node import-mobile-data.js
```

**Requirements:**
- You need to run the generate script first
- You need to have MongoDB connection details in your backend `.env` file
- You need to install mongoose: `npm install mongoose dotenv`

## Data Structure

Each mobile product includes:
- Title (brand + series + model number)
- Price (calculated based on specifications)
- Rich HTML description
- Category ("mobile")
- Stock quantity
- Multiple images (placeholder URLs)
- Detailed specifications:
  - Brand
  - Model
  - Processor
  - RAM
  - Storage
  - Camera details
  - Battery capacity
  - Screen details
  - Color

## Manual MongoDB Import

If you prefer to import the data manually, you can use the MongoDB import tool:

```bash
mongoimport --db=your-database-name --collection=products --file=output/mobile-products.json --jsonArray
```

## Customization

You can customize the generated data by modifying the arrays in the `generate-mobile-data.js` file:
- Add or remove brands and their series
- Modify processor options
- Change RAM and storage configurations
- Adjust camera specifications
- Change price calculations

## Troubleshooting

If you encounter any issues:

1. Make sure MongoDB is running
2. Verify your connection string in the backend `.env` file
3. Check that the product schema in `import-mobile-data.js` matches your actual database schema
4. If you get duplicate key errors, you may have existing products with the same IDs

## Note

These scripts are meant for development and testing purposes. The generated data uses placeholder images rather than actual product images. 