import { createWorker } from 'tesseract.js';
import { MSG_OCR_FAILED } from '../constants/messages.js';

// Simple recognize function; later we can switch to a worker pool if needed
export async function recognizeText(buffer) {
  const worker = await createWorker('eng'); // downloads eng data on first run
  try {
    const result = await worker.recognize(buffer, {
      // You can tweak params per field later
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
