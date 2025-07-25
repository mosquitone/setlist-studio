const sharp = require('sharp');

const fs = require('fs').promises;
const path = require('path');

const QUALITY = 85;
const INPUT_DIR = path.join(__dirname, '../public');
const OUTPUT_DIR = path.join(__dirname, '../public');

const images = [
  { input: 'MQT_LOGO_BLACK.png', output: 'MQT_LOGO_BLACK.webp' },
  { input: 'MQTN_LOGO_white_ver_nonback.png', output: 'MQTN_LOGO_white_ver_nonback.webp' },
  { input: 'setlist-mosquitone-black.png', output: 'setlist-mosquitone-black.webp' },
  { input: 'setlist-mosquitone-white.png', output: 'setlist-mosquitone-white.webp' },
  { input: 'setlist-studio-logo.png', output: 'setlist-studio-logo.webp' },
  { input: 'soft-wallpaper.png', output: 'soft-wallpaper.webp' },
];

async function optimizeImages() {
  for (const img of images) {
    const inputPath = path.join(INPUT_DIR, img.input);
    const outputPath = path.join(OUTPUT_DIR, img.output);

    try {
      await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);

      const inputStats = await fs.stat(inputPath);
      const outputStats = await fs.stat(outputPath);
      const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(2);

      console.log(`✓ ${img.input} → ${img.output} (${reduction}% reduction)`);
    } catch (error) {
      console.error(`✗ Failed to optimize ${img.input}:`, error.message);
    }
  }
}

optimizeImages().catch(console.error);
