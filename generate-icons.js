const sharp = require('sharp');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputImage = path.join(__dirname, 'icons', 'unnamed.png');

async function generateIcons() {
    for (const size of sizes) {
        const outputPath = path.join(__dirname, 'icons', `icon-${size}.png`);
        await sharp(inputImage)
            .resize(size, size)
            .png()
            .toFile(outputPath);
        console.log(`Created icon-${size}.png`);
    }
    console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
