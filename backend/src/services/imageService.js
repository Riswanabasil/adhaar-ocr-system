import sharp from 'sharp';
import { MSG_PREPROCESS_FAILED } from '../constants/messages.js';

export async function preprocessBuffer(inputBuffer) {
  try {
    // Auto-orient (EXIF), grayscale, normalize contrast, and resize if very small
    const image = sharp(inputBuffer, { failOnError: false }).rotate(); // auto-orient

    const metadata = await image.metadata();
    const targetWidth = Math.max(1400, metadata.width || 0); // ensure decent OCR size

    const out = await image
      .resize({ width: targetWidth, withoutEnlargement: false })
      .grayscale()
      .normalize() // boost contrast
      .toFormat('png') // consistent for OCR
      .toBuffer();

    return out;
  } catch (err) {
    const error = new Error(MSG_PREPROCESS_FAILED);
    error.cause = err;
    throw error;
  }
}
