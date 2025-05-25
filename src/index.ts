import { readPng } from './pngOperations';
import { pngToAscii } from './pngToAscii';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Please provide a PNG file name as an argument.');
    process.exit(1);
}

const pngFileName = args[0];
const ratio = parseInt(args[1], 10) || 50;

const png = readPng(pngFileName);

const ascii = pngToAscii(png, ratio);
console.log(ascii);
