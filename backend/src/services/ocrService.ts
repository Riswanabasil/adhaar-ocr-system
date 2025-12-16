// import { createWorker } from 'tesseract.js';
// import { MSG_OCR_FAILED } from '../constants/messages';

// export async function recognizeText(buffer) {
//   const worker = await createWorker('eng');
//   try {
//     const result = await worker.recognize(buffer, {
      
//       psm: 6,
//       // Allow only characters we actually expect on the card
//       tessedit_char_whitelist:
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:;-/()'",
//       preserve_interword_spaces: 1,
//       // A higher DPI improves recognition (image is already normalized)
//       user_defined_dpi: 300,
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
import { createWorker, Worker, RecognizeResult } from "tesseract.js";
import { MSG_OCR_FAILED } from "../constants/messages";

interface WithCauseError extends Error {
  cause?: unknown;
}

export async function recognizeText(buffer: Buffer): Promise<RecognizeResult> {
  const worker: Worker = await createWorker("eng");

  try {
    const result = await worker.recognize(
      buffer,
      {
        psm: 6,
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:;-/()'",
        preserve_interword_spaces: 1,
        user_defined_dpi: 300,
      } as any // ← IMPORTANT FIX
    );

    return result;
  } catch (err) {
    const e: WithCauseError = new Error(MSG_OCR_FAILED);
    e.cause = err;
    throw e;
  } finally {
    await worker.terminate();
  }
}
