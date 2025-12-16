
// import { createWorker, Worker, RecognizeResult } from "tesseract.js";
// import { MSG_OCR_FAILED } from "../constants/messages";

// interface WithCauseError extends Error {
//   cause?: unknown;
// }

// export async function recognizeText(buffer: Buffer): Promise<RecognizeResult> {
//   const worker: Worker = await createWorker("eng");

//   try {
//     const result = await worker.recognize(
//       buffer,
//       {
//         psm: 6,
//         tessedit_char_whitelist:
//           "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:;-/()'",
//         preserve_interword_spaces: 1,
//         user_defined_dpi: 300,
//       } as any // ← IMPORTANT FIX
//     );

//     return result;
//   } catch (err) {
//     const e: WithCauseError = new Error(MSG_OCR_FAILED);
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

class OcrService {
  public async recognize(buffer: Buffer): Promise<RecognizeResult> {
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
        } as any
      );

      return result;
    } catch (err) {
      const error: WithCauseError = new Error(MSG_OCR_FAILED);
      error.cause = err;
      throw error;
    } finally {
      await worker.terminate();
    }
  }
}

export default new OcrService();
