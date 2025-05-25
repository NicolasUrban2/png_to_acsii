import * as fs from 'fs';
import { compressPng, readPng } from './readPng';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Please provide a PNG file name as an argument.');
    process.exit(1);
}

const pngFileName = args[0];

const asciiWidth = 50;
const png = readPng(pngFileName);

const ratio = Math.ceil(png.width / asciiWidth);

const compressedPng = compressPng(readPng(pngFileName), ratio);
const outputFileName = pngFileName.replace(/\.png$/, '-compressed.png');
const stream = compressedPng.pack();

const chunks: Buffer[] = [];
stream.on('data', (chunk) => chunks.push(chunk));
stream.on('end', () => {
    const data = Buffer.concat(chunks);
    console.log(`Compressed PNG data length: ${data.length} bytes`);
    fs.writeFileSync(outputFileName, data);
    console.log(`Compressed PNG saved as "${outputFileName}"`);
});
stream.on('error', (err) => {
    console.error('Error while compressing PNG:', err);
});
