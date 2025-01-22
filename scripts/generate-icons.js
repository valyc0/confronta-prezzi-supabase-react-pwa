import sharp from 'sharp';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = join(__dirname, '../public/icons/manifest-icon-512.maskable.png');
const outputDir = join(__dirname, '../public/icons');

async function generateIcons() {
  try {
    // Read the source image
    const imageBuffer = await fs.readFile(sourceIcon);

    // Generate each size
    for (const size of sizes) {
      const outputPath = join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(imageBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated ${size}x${size} icon`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
