/**
 * Generate gallery.json file with list of all images in the gallery folder
 * Run this script after adding new images to the gallery folder:
 * node scripts/generate-gallery-list.js
 */

const fs = require('fs');
const path = require('path');

// Get the pizzadojo2go directory (parent of scripts folder)
const pizzadojo2goDir = path.resolve(__dirname, '..');
const galleryDir = path.join(pizzadojo2goDir, 'assets', 'images', 'gallery');
const outputFile = path.join(galleryDir, 'gallery.json');

// Debug: log the paths being used
console.log('📁 Script directory:', __dirname);
console.log('📁 Pizzadojo2go directory:', pizzadojo2goDir);
console.log('📁 Gallery directory:', galleryDir);
console.log('📄 Output file:', outputFile);
console.log('');

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

try {
  // Check if gallery directory exists
  if (!fs.existsSync(galleryDir)) {
    console.error(`❌ Gallery directory does not exist: ${galleryDir}`);
    console.error(`   Please create the directory: assets/images/gallery/`);
    process.exit(1);
  }

  // Read all files in gallery directory
  const files = fs.readdirSync(galleryDir);
  
  // Filter for image files only
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });

  // Sort by filename descending (newest first - filenames are YYYYMMDD_HHMMSS)
  imageFiles.sort((a, b) => b.localeCompare(a));

  // Create JSON structure
  const galleryData = {
    images: imageFiles,
    lastUpdated: new Date().toISOString(),
    count: imageFiles.length
  };

  // Write to gallery.json
  fs.writeFileSync(outputFile, JSON.stringify(galleryData, null, 2));

  console.log(`✅ Generated gallery.json with ${imageFiles.length} images:`);
  imageFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  console.log(`\n📄 Saved to: ${outputFile}`);
  
} catch (error) {
  console.error('❌ Error generating gallery list:', error.message);
  process.exit(1);
}
