import * as fs from 'fs';
import { compressPng, readPng } from './pngOperations';
import { pngToAscii } from './pngToAscii';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Please provide a PNG file name as an argument.');
    process.exit(1);
}

const pngFileName = args[0];

const png = readPng(pngFileName);

const ascii = pngToAscii(png, 50);
console.log(ascii);
