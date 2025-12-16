// import sharp from 'sharp';
// import { MSG_PREPROCESS_FAILED } from '../constants/messages';

// export async function preprocessBuffer(inputBuffer) {
//   try {
//     // Auto-orient (EXIF), grayscale, normalize contrast, and resize if very small
//     const image = sharp(inputBuffer, { failOnError: false }).rotate(); // auto-orient

//     const metadata = await image.metadata();
//     const targetWidth = Math.max(1400, metadata.width || 0); // ensure decent OCR size

//     const out = await image
//       .resize({ width: targetWidth, withoutEnlargement: false })
//       .grayscale()
//       .normalize() // boost contrast
//       .toFormat('png') // consistent for OCR
//       .toBuffer();

//     return out;
//   } catch (err) {
//     const error = new Error(MSG_PREPROCESS_FAILED);
//     error.cause = err;
//     throw error;
//   }
// }


import sharp from "sharp";
import { MSG_PREPROCESS_FAILED } from "../constants/messages";

// Extend Error to include `.cause`
interface WithCauseError extends Error {
  cause?: unknown;
}

export async function preprocessBuffer(inputBuffer: Buffer): Promise<Buffer> {
  try {
    // Auto-orient (EXIF), grayscale, normalize, resize
    const image = sharp(inputBuffer, { failOnError: false }).rotate();

    const metadata = await image.metadata();
    const targetWidth = Math.max(1400, metadata.width || 0);

    const out = await image
      .resize({ width: targetWidth, withoutEnlargement: false })
      .grayscale()
      .normalize()
      .toFormat("png")
      .toBuffer();

    return out;
  } catch (err) {
    const error: WithCauseError = new Error(MSG_PREPROCESS_FAILED);
    error.cause = err;
    throw error;
  }
}
