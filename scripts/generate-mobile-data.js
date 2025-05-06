/**
 * Mobile Phone Data Generator Script
 * 
 * This script generates data for 30 mobile phones with realistic specifications,
 * prices, and images. Run this script with Node.js to generate a JSON file
 * that can be imported into MongoDB.
 * 
 * Usage: 
 * node generate-mobile-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Brands with their typical series
const brands = [
  { name: 'Samsung', series: ['Galaxy S', 'Galaxy A', 'Galaxy Note', 'Galaxy Z Fold', 'Galaxy Z Flip'] },
  { name: 'Apple', series: ['iPhone', 'iPhone Pro', 'iPhone Pro Max', 'iPhone SE'] },
  { name: 'Xiaomi', series: ['Redmi Note', 'Redmi', 'Mi', 'POCO'] },
  { name: 'OnePlus', series: ['OnePlus', 'Nord'] },
  { name: 'Google', series: ['Pixel', 'Pixel Pro', 'Pixel a'] },
  { name: 'Motorola', series: ['Moto G', 'Moto E', 'Edge'] },
  { name: 'Nokia', series: ['Nokia'] },
  { name: 'Sony', series: ['Xperia'] },
  { name: 'ASUS', series: ['ROG Phone', 'Zenfone'] },
  { name: 'Realme', series: ['GT', 'Narzo', 'Realme'] }
];

// Processor options
const processors = [
  'Snapdragon 8 Gen 3',
  'Snapdragon 8 Gen 2',
  'Snapdragon 778G',
  'Snapdragon 695',
  'MediaTek Dimensity 9300',
  'MediaTek Dimensity 9200',
  'MediaTek Dimensity 8200',
  'MediaTek Helio G99',
  'Apple A17 Pro',
  'Apple A16 Bionic',
  'Apple A15 Bionic',
  'Exynos 2400',
  'Exynos 2200',
  'Google Tensor G3',
  'Google Tensor G2'
];

// RAM options
const ramOptions = [4, 6, 8, 12, 16];

// Storage options
const storageOptions = [64, 128, 256, 512, 1024]; // 1024 = 1TB

// Camera configurations
const cameraConfigs = [
  { main: '12MP', ultrawide: '12MP', telephoto: null, selfie: '12MP' },
  { main: '50MP', ultrawide: '12MP', telephoto: null, selfie: '12MP' },
  { main: '50MP', ultrawide: '8MP', telephoto: null, selfie: '13MP' },
  { main: '64MP', ultrawide: '8MP', telephoto: null, selfie: '16MP' },
  { main: '108MP', ultrawide: '12MP', telephoto: null, selfie: '20MP' },
  { main: '50MP', ultrawide: '12MP', telephoto: '10MP', selfie: '12MP' },
  { main: '50MP', ultrawide: '48MP', telephoto: '12MP', selfie: '12MP' },
  { main: '48MP', ultrawide: '12MP', telephoto: '48MP', selfie: '12MP' },
  { main: '200MP', ultrawide: '12MP', telephoto: '10MP', selfie: '12MP' },
  { main: '200MP', ultrawide: '50MP', telephoto: '10MP', selfie: '32MP' }
];

// Battery capacities
const batteryOptions = [3000, 3500, 4000, 4500, 5000, 5500, 6000];

// Screen sizes
const screenSizes = ['5.4"', '6.1"', '6.5"', '6.7"', '6.8"', '7.0"'];

// Screen types
const screenTypes = ['AMOLED', 'Super AMOLED', 'IPS LCD', 'LTPO AMOLED', 'OLED', 'Dynamic AMOLED 2X'];

// Colors
const colors = ['Black', 'White', 'Blue', 'Green', 'Red', 'Purple', 'Yellow', 'Silver', 'Gray', 'Gold', 'Pink', 'Titanium'];

// Sample real-looking image URLs from placeholder services
const getImageUrls = (brand, model) => {
  const encodedName = encodeURIComponent(`${brand} ${model}`);
  const baseUrl = "https://placehold.co/800x800/";
  
  // Create colors for the placeholder images to make them look different
  const colorCodes = [
    "1a73e8/FFFFFF", // Blue
    "202124/FFFFFF", // Dark Gray
    "E91E63/FFFFFF", // Pink
    "7CB342/FFFFFF", // Green
    "FFD54F/202124"  // Yellow
  ];
  
  // Pick random colors for each image
  return Array(Math.floor(Math.random() * 2) + 2).fill(0).map((_, i) => {
    const colorCode = colorCodes[Math.floor(Math.random() * colorCodes.length)];
    return {
      public_id: `mobiles/${brand.toLowerCase()}_${model.toLowerCase().replace(/\s+/g, '_')}_${i}`,
      url: `${baseUrl}${colorCode}?text=${encodedName}`
    };
  });
};

// Generate a random number between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Get a random element from an array
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Generate a unique product for each iteration
const generateProduct = (index) => {
  const brand = getRandomElement(brands);
  const series = getRandomElement(brand.series);
  const modelNumber = getRandomInt(1, 30);
  const title = `${brand.name} ${series} ${modelNumber}`;
  
  const ram = getRandomElement(ramOptions);
  const storage = getRandomElement(storageOptions);
  const processor = getRandomElement(processors);
  const camera = getRandomElement(cameraConfigs);
  const battery = getRandomElement(batteryOptions);
  const screenSize = getRandomElement(screenSizes);
  const screenType = getRandomElement(screenTypes);
  const color = getRandomElement(colors);
  
  // Generate price based on specifications
  const basePrice = 200;
  const ramMultiplier = ram * 20;
  const storageMultiplier = storage * 0.4;
  const processorMultiplier = processors.indexOf(processor) * 50;
  const cameraMultiplier = camera.telephoto ? 200 : 100;
  
  let price = basePrice + ramMultiplier + storageMultiplier + processorMultiplier + cameraMultiplier;
  
  // Add premium for certain brands
  if (brand.name === 'Apple') price *= 1.5;
  if (brand.name === 'Samsung' && series.includes('Galaxy S')) price *= 1.3;
  if (brand.name === 'Google' && series.includes('Pixel Pro')) price *= 1.2;
  
  // Round price to common marketing price points
  price = Math.round(price / 50) * 50 - 0.01;
  
  // Make sure price is realistic
  price = Math.max(199.99, Math.min(price, 1999.99));
  
  // Generate description with HTML
  const description = `
<h2>${title} - ${ram}GB RAM, ${storage}GB Storage</h2>

<p>Experience the power and style of the ${title}. This premium smartphone features cutting-edge technology and sleek design.</p>

<h3>Key Features:</h3>
<ul>
  <li><strong>Display:</strong> ${screenSize} ${screenType} screen with vibrant colors and deep blacks</li>
  <li><strong>Performance:</strong> ${processor} processor with ${ram}GB RAM for smooth multitasking</li>
  <li><strong>Storage:</strong> ${storage}GB internal storage for all your apps, photos, and videos</li>
  <li><strong>Camera System:</strong> ${camera.main} main camera${camera.ultrawide ? `, ${camera.ultrawide} ultrawide camera` : ''}${camera.telephoto ? `, ${camera.telephoto} telephoto camera` : ''}</li>
  <li><strong>Selfie Camera:</strong> ${camera.selfie} front-facing camera for beautiful selfies</li>
  <li><strong>Battery:</strong> ${battery}mAh for all-day usage</li>
  <li><strong>Colors Available:</strong> ${color} (other colors may be available)</li>
</ul>

<p>The ${title} sets new standards in mobile technology with its advanced features and elegant design. Whether you're a photography enthusiast, gamer, or professional, this device delivers exceptional performance for all your needs.</p>

<h3>What's in the Box:</h3>
<ul>
  <li>${title} smartphone</li>
  <li>USB-C charging cable</li>
  <li>Quick start guide</li>
  <li>SIM ejector tool</li>
</ul>

<h3>Technical Specifications:</h3>
<table style="width:100%; border-collapse: collapse; margin-top: 15px;">
  <tr>
    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2;">Specification</th>
    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2;">Details</th>
  </tr>
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Brand</strong></td>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${brand.name}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Model</strong></td>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${series} ${modelNumber}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Processor</strong></td>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${processor}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>RAM</strong></td>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${ram}GB</td>
  </tr>
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Storage</strong></td>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${storage}GB</td>
  </tr>
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Display Size</strong></td>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${screenSize}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Display Type</strong></td>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${screenType}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Main Camera</strong></td>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${camera.main}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Ultrawide Camera</strong></td>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${camera.ultrawide || 'N/A'}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Telephoto Camera</strong></td>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${camera.telephoto || 'N/A'}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Selfie Camera</strong></td>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${camera.selfie}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Battery Capacity</strong></td>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${battery}mAh</td>
  </tr>
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Color</strong></td>
    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${color}</td>
  </tr>
</table>
`;

  return {
    title,
    price,
    description,
    category: "mobile",
    stock: getRandomInt(10, 100),
    images: getImageUrls(brand.name, `${series} ${modelNumber}`),
    specifications: {
      brand: brand.name,
      model: `${series} ${modelNumber}`,
      processor,
      ram: `${ram}GB`,
      storage: `${storage}GB`,
      camera: {
        main: camera.main,
        ultrawide: camera.ultrawide,
        telephoto: camera.telephoto,
        selfie: camera.selfie
      },
      battery: `${battery}mAh`,
      screen: `${screenSize} ${screenType}`,
      color
    }
  };
};

// Generate 30 mobile products
const generateMobileProducts = () => {
  const products = [];
  for (let i = 0; i < 30; i++) {
    products.push(generateProduct(i));
  }
  return products;
};

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Generate data and write to file
const mobileProducts = generateMobileProducts();
fs.writeFileSync(
  path.join(outputDir, 'mobile-products.json'), 
  JSON.stringify(mobileProducts, null, 2)
);

console.log('Successfully generated data for 30 mobile products!');
console.log(`Output file: ${path.join(outputDir, 'mobile-products.json')}`);
console.log('\nTo import this data into MongoDB, you can use the mongoimport tool:');
console.log('mongoimport --db=your-database-name --collection=products --file=output/mobile-products.json --jsonArray'); 