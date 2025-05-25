import * as fs from 'fs';
import { PNG } from 'pngjs';

export function readPng(filename: string): PNG {
    if (!fs.existsSync(filename)) {
        console.error(`File "${filename}" does not exist.`);
        process.exit(1);
    }

    const data = fs.readFileSync(filename);
    return PNG.sync.read(data);
}

export function compressPng(png: PNG, ratio: number): PNG {
    const compressedPng = new PNG({
        width: Math.floor(png.width / ratio),
        height: Math.floor(png.height / ratio),
        filterType: -1 // Use default filter type
    });

    for (let y = 0; y < png.height; y += ratio) {
        for (let x = 0; x < png.width; x += ratio) {
            const compressedX = Math.floor(x / ratio);
            const compressedY = Math.floor(y / ratio);

            const pixels = getPixelsArea(png, x, y, ratio);
            const red = getPixelsAverageColor(png, pixels, 'red');
            const green = getPixelsAverageColor(png, pixels, 'green');
            const blue = getPixelsAverageColor(png, pixels, 'blue');
            const alpha = 255;

            const compressedIndex = (compressedY * compressedPng.width + compressedX) << 2;
            compressedPng.data[compressedIndex] = red;
            compressedPng.data[compressedIndex + 1] = green;
            compressedPng.data[compressedIndex + 2] = blue;
            compressedPng.data[compressedIndex + 3] = alpha;
        }
    }

    return compressedPng;
}

function getPixelIndex(png: PNG, x: number, y: number): number {
    if (areCoordinatesValid(png, x, y)) {
        return (y * png.width + x) << 2;
    }
    throw new Error('Coordinates out of bounds');
}

function areCoordinatesValid(png: PNG, x: number, y: number): boolean {
    return x >= 0 && x < png.width && y >= 0 && y < png.height;
}

function getPixelsArea(png: PNG, x: number, y: number, ratio: number): number[] {
    const pixels: number[] = [];
    for (let i = 0; i < ratio; i++) {
        for (let j = 0; j < ratio; j++) {
            if (!areCoordinatesValid(png, x + i, y + j)) {
                continue;
            }
            pixels.push(getPixelIndex(png, x + i, y + j));
        }
    }
    return pixels;
}

function getPixelsAverageColor(png: PNG, idxes: number[], color: 'red' | 'green' | 'blue' | 'alpha'): number {
    let sum = 0;
    for (const idx of idxes) {
        sum += getPixelColor(png, idx, color);
    }
    return Math.floor(sum / idxes.length);
}

function getPixelColor(png: PNG, idx: number, color: 'red' | 'green' | 'blue' | 'alpha'): number {
    switch (color) {
        case 'red':
            return png.data[idx];
        case 'green':
            return png.data[idx + 1];
        case 'blue':
            return png.data[idx + 2];
        case 'alpha':
            return png.data[idx + 3];
        default:
            throw new Error('Invalid color specified');
    }
}