import { createWorker } from 'tesseract.js';
import { MSG_OCR_FAILED } from '../constants/messages.js';

// Simple recognize function; later we can switch to a worker pool if needed
// export async function recognizeText(buffer) {
//   const worker = await createWorker('eng'); // downloads eng data on first run
//   try {
//     const result = await worker.recognize(buffer, {
//       // You can tweak params per field later
//     });
//     return result;
//   } catch (err) {
//     const e = new Error(MSG_OCR_FAILED);
//     e.cause = err;
//     throw e;
//   } finally {
//     await worker.terminate();
//   }
// }
// services/ocrService.js
export async function recognizeText(buffer) {
  const worker = await createWorker('eng');
  try {
    const result = await worker.recognize(buffer, {
      // Prefer block of text; works well for ID cards
      // psm: 6 in tesseract.js:
      // NOTE: tesseract.js uses `psm` directly.
      psm: 6,
      // Allow only characters we actually expect on the card
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:;-/()'",
      preserve_interword_spaces: 1,
      // A higher DPI improves recognition (image is already normalized)
      user_defined_dpi: 300,
    });
    return result;
  } catch (err) {
    const e = new Error(MSG_OCR_FAILED);
    e.cause = err;
    throw e;
  } finally {
    await worker.terminate();
  }
}
