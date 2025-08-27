#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Configuration
const INPUT_DIR = path.join(__dirname, '..', 'public', 'assets');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'webp');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.bmp'];
const QUALITY_SETTINGS = {
  webp: 85,
  jpeg: 85,
  png: 90
};

// Responsive breakpoints
const BREAKPOINTS = {
  sm: 400,
  md: 800,
  lg: 1200,
  xl: 1600
};

// Ensure output directory exists
const ensureDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
};

// Get all image files recursively
const getImageFiles = async (dir, fileList = []) => {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);
    
    if (fileStat.isDirectory()) {
      await getImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  
  return fileList;
};

// Convert single image to WebP with multiple sizes
const convertImage = async (inputPath, outputDir) => {
  const fileName = path.basename(inputPath, path.extname(inputPath));
  const relativePath = path.relative(INPUT_DIR, path.dirname(inputPath));
  const targetDir = path.join(outputDir, relativePath);
  
  ensureDirectory(targetDir);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`📸 Processing: ${path.relative(INPUT_DIR, inputPath)}`);
    console.log(`   Original: ${metadata.width}x${metadata.height} (${metadata.format})`);
    
    const conversions = [];
    
    // Generate responsive sizes
    for (const [sizeName, width] of Object.entries(BREAKPOINTS)) {
      if (width <= metadata.width) {
        // WebP version
        const webpPath = path.join(targetDir, `${fileName}-${sizeName}.webp`);
        conversions.push(
          image
            .clone()
            .resize(width, null, { 
              withoutEnlargement: true,
              fit: 'inside'
            })
            .webp({ quality: QUALITY_SETTINGS.webp })
            .toFile(webpPath)
            .then(() => {
              console.log(`   ✅ WebP ${sizeName}: ${webpPath}`);
              return { format: 'webp', size: sizeName, path: webpPath };
            })
        );
        
        // Original format fallback
        const originalFormat = metadata.format === 'jpeg' ? 'jpg' : metadata.format;
        const fallbackPath = path.join(targetDir, `${fileName}-${sizeName}.${originalFormat}`);
        
        if (metadata.format === 'jpeg') {
          conversions.push(
            image
              .clone()
              .resize(width, null, { 
                withoutEnlargement: true,
                fit: 'inside'
              })
              .jpeg({ quality: QUALITY_SETTINGS.jpeg })
              .toFile(fallbackPath)
              .then(() => {
                console.log(`   ✅ JPEG ${sizeName}: ${fallbackPath}`);
                return { format: 'jpeg', size: sizeName, path: fallbackPath };
              })
          );
        } else if (metadata.format === 'png') {
          conversions.push(
            image
              .clone()
              .resize(width, null, { 
                withoutEnlargement: true,
                fit: 'inside'
              })
              .png({ quality: QUALITY_SETTINGS.png })
              .toFile(fallbackPath)
              .then(() => {
                console.log(`   ✅ PNG ${sizeName}: ${fallbackPath}`);
                return { format: 'png', size: sizeName, path: fallbackPath };
              })
          );
        }
      }
    }
    
    // Also create a full-size WebP version
    const fullWebpPath = path.join(targetDir, `${fileName}.webp`);
    conversions.push(
      image
        .clone()
        .webp({ quality: QUALITY_SETTINGS.webp })
        .toFile(fullWebpPath)
        .then(() => {
          console.log(`   ✅ WebP full: ${fullWebpPath}`);
          return { format: 'webp', size: 'full', path: fullWebpPath };
        })
    );
    
    await Promise.all(conversions);
    
    // Calculate size savings
    const originalStats = await stat(inputPath);
    const webpStats = await stat(fullWebpPath);
    const savings = ((originalStats.size - webpStats.size) / originalStats.size * 100).toFixed(1);
    
    console.log(`   💾 Size reduction: ${savings}% (${formatBytes(originalStats.size)} → ${formatBytes(webpStats.size)})`);
    
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
};

// Format bytes for display
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate image manifest for better organization
const generateManifest = async (outputDir) => {
  const manifestPath = path.join(outputDir, 'image-manifest.json');
  const images = await getImageFiles(outputDir);
  
  const manifest = {
    generated: new Date().toISOString(),
    breakpoints: BREAKPOINTS,
    quality: QUALITY_SETTINGS,
    images: images.map(img => ({
      path: path.relative(outputDir, img),
      size: fs.statSync(img).size,
      modified: fs.statSync(img).mtime
    }))
  };
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`📋 Generated manifest: ${manifestPath}`);
};

// Main conversion function
const convertImages = async () => {
  console.log('🚀 Starting image conversion...');
  console.log(`📁 Input directory: ${INPUT_DIR}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  
  try {
    // Ensure output directory exists
    ensureDirectory(OUTPUT_DIR);
    
    // Get all image files
    const imageFiles = await getImageFiles(INPUT_DIR);
    console.log(`🔍 Found ${imageFiles.length} images to process`);
    
    if (imageFiles.length === 0) {
      console.log('ℹ️  No images found to convert');
      return;
    }
    
    // Process images
    const startTime = Date.now();
    
    for (const imagePath of imageFiles) {
      await convertImage(imagePath, OUTPUT_DIR);
    }
    
    // Generate manifest
    await generateManifest(OUTPUT_DIR);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✨ Conversion complete!`);
    console.log(`⏱️  Processing time: ${duration}s`);
    console.log(`📊 Processed ${imageFiles.length} images`);
    
  } catch (error) {
    console.error('❌ Conversion failed:', error);
    process.exit(1);
  }
};

// CLI usage
if (require.main === module) {
  // Check if Sharp is installed
  try {
    require.resolve('sharp');
  } catch (error) {
    console.error('❌ Sharp is not installed. Install it with:');
    console.error('   npm install sharp --save-dev');
    process.exit(1);
  }
  
  convertImages();
}

module.exports = { convertImages, convertImage, BREAKPOINTS, QUALITY_SETTINGS };