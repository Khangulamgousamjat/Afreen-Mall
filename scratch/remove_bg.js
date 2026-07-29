const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processDarkLogo(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Perceived brightness / luminance
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (lum < 35) {
      data[i + 3] = 0; // Fully transparent
    } else if (lum < 70) {
      // Smooth feather transition
      const alphaFraction = (lum - 35) / 35;
      data[i + 3] = Math.round(alphaFraction * 255);
    } else {
      // Enhance brightness of gold & emerald green elements
      data[i] = Math.min(255, Math.round(r * 1.15));
      data[i + 1] = Math.min(255, Math.round(g * 1.2));
      data[i + 2] = Math.min(255, Math.round(b * 1.15));
    }
  }

  await sharp(data, {
    raw: { width, height, channels }
  })
  .png()
  .toFile(outputPath);

  console.log('Dark logo processed:', outputPath);
}

async function processLightLogo(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (lum > 220) {
      data[i + 3] = 0; // Fully transparent
    } else if (lum > 180) {
      const alphaFraction = (220 - lum) / 40;
      data[i + 3] = Math.round(alphaFraction * 255);
    }
  }

  await sharp(data, {
    raw: { width, height, channels }
  })
  .png()
  .toFile(outputPath);

  console.log('Light logo processed:', outputPath);
}

async function main() {
  const publicDir = path.join(__dirname, '..', 'apps', 'web', 'public');
  const darkInput = path.join(publicDir, 'logo dark .png');
  const lightInput = path.join(publicDir, 'logo light .png');

  // Process existing logos into transparent versions
  await processDarkLogo(darkInput, path.join(publicDir, 'logo-dark-transparent.png'));
  await processLightLogo(lightInput, path.join(publicDir, 'logo-light-transparent.png'));

  // Overwrite existing files by unlinking first if present
  try { if (fs.existsSync(darkInput)) fs.unlinkSync(darkInput); } catch (e) {}
  fs.copyFileSync(path.join(publicDir, 'logo-dark-transparent.png'), darkInput);

  try { if (fs.existsSync(lightInput)) fs.unlinkSync(lightInput); } catch (e) {}
  fs.copyFileSync(path.join(publicDir, 'logo-light-transparent.png'), lightInput);
}

main().catch(err => {
  console.error('Error processing logos:', err);
  process.exit(1);
});
