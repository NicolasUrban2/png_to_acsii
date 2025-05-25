import { PNG } from "pngjs";
import { compressPng } from "./pngOperations";

export function pngToAscii(png: PNG, width: number): string {
    const ratio = Math.ceil(png.width / width);
    const compressedPng = compressPng(png, ratio);

    let ascii = '';

    for (let y = 0; y < compressedPng.height; y++) {
        for (let x = 0; x < compressedPng.width; x++) {
            const idx = (y * compressedPng.width + x) << 2;
            ascii += getAsciiCharForPixel(compressedPng, idx);
        }
        ascii += '\n';
    }

    return ascii;
}

function getAsciiCharForPixel(png: PNG, idx: number): string {
    const asciiChars = '@%#*+=-:. ';
    const red = png.data[idx];
    const green = png.data[idx + 1];
    const blue = png.data[idx + 2];
    const brightness = (red + green + blue) / 3;
    const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
    return asciiChars[charIndex];
}