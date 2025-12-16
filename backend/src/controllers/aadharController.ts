// import { Request, Response } from "express"
// import { MSG_HEALTH_OK, MSG_PARSE_SUCCESS } from '../constants/messages';
// import { OK, SERVER_ERROR } from '../constants/statusCodes';
// import { preprocessBuffer } from '../services/imageService';
// import { recognizeText } from '../services/ocrService';
// import { extractAddressFromBack, extractNameFromFront, findAadhaarIn, parseAadhaarData } from '../utils/parseUtils';

// export const health = (_req, res) => {
//   res.status(OK).json({ status: true, message: MSG_HEALTH_OK });
// };

// export const parseImmediate = async (req:Request, res:Response) => {
//   try {
//     const front = req.files.front[0];
//     const back = req.files.back[0];

//     // Preprocess images with Sharp
//     const [frontBuf, backBuf] = await Promise.all([
//       preprocessBuffer(front.buffer),
//       preprocessBuffer(back.buffer),
//     ]);

//     // Run OCR on each side
//     const [frontOCR, backOCR] = await Promise.all([
//       recognizeText(frontBuf),
//       recognizeText(backBuf),
//     ]);

//     const rawTextFront = frontOCR.data.text || '';
//     const rawTextBack = backOCR.data.text || '';
//     const combined = `${rawTextFront}\n${rawTextBack}`;

//     // Parse structured fields (basic for now)
// //     const parsed = parseAadhaarData(combined);
// //     parsed.name = extractName(rawTextFront);
// // parsed.address = extractAddress(rawTextBack);

// //     // You can also pass through confidences from Tesseract results if needed.
// //     return res.status(OK).json({
// //       status: true,
// //       message: MSG_PARSE_SUCCESS,
// //       data: parsed,
// //       raw: {
// //         front: rawTextFront,
// //         back: rawTextBack,
// //       },
// //     });

// const parsed = parseAadhaarData(combined);

// // Name from front-side lines
// parsed.name = extractNameFromFront(rawTextFront) || parsed.name;

// // Address from back-side lines
// parsed.address = extractAddressFromBack(rawTextBack) || parsed.address;

// // Extra: compute “isUidSame” by checking front/back separately (optional)
// const uidFront = findAadhaarIn(rawTextFront);
// const uidBack  = findAadhaarIn(rawTextBack);
// const isUidSame = uidFront && uidBack ? (uidFront === uidBack) : null;

// // If gender shows as single-letter (M/F) but “FEMALE/MALE” exists in text, prefer the full word
// if ((!parsed.gender || parsed.gender.length === 1) && /female/i.test(combined)) parsed.gender = 'FEMALE';
// if ((!parsed.gender || parsed.gender.length === 1) && /male/i.test(combined))   parsed.gender = 'MALE';

// // send response
// return res.status(OK).json({
//   status: true,
//   message: MSG_PARSE_SUCCESS,
//   data: { ...parsed, isUidSame },
//   raw: { front: rawTextFront, back: rawTextBack },
// });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(SERVER_ERROR)
//       .json({ status: false, message: err.message || 'Server error' });
//   }
// };


import { Request, Response } from "express";
import multer from "multer";

import {
  MSG_HEALTH_OK,
  MSG_PARSE_SUCCESS
} from "../constants/messages";
import { OK, SERVER_ERROR } from "../constants/statusCodes";
import { preprocessBuffer } from "../services/imageService";
import { recognizeText } from "../services/ocrService";
import {
  extractAddressFromBack,
  extractNameFromFront,
  findAadhaarIn,
  parseAadhaarData
} from "../utils/parseUtils";

// CORRECT TYPE for Multer files
interface MulterRequest extends Request {
  files: {
    front: Express.Multer.File[];
    back: Express.Multer.File[];
  };
}

export const health = (_req: Request, res: Response) => {
  return res.status(OK).json({ status: true, message: MSG_HEALTH_OK });
};

export const parseImmediate = async (req: MulterRequest, res: Response) => {
  try {
    const front = req.files?.front?.[0];
    const back = req.files?.back?.[0];

    if (!front || !back) {
      return res
        .status(SERVER_ERROR)
        .json({ status: false, message: "Files missing" });
    }

    const [frontBuf, backBuf] = await Promise.all([
      preprocessBuffer(front.buffer),
      preprocessBuffer(back.buffer),
    ]);

    const [frontOCR, backOCR] = await Promise.all([
      recognizeText(frontBuf),
      recognizeText(backBuf),
    ]);

    const rawTextFront = frontOCR?.data?.text || "";
    const rawTextBack = backOCR?.data?.text || "";
    const combined = `${rawTextFront}\n${rawTextBack}`;

    const parsed = parseAadhaarData(combined);

    parsed.name = extractNameFromFront(rawTextFront) || parsed.name;
    parsed.address = extractAddressFromBack(rawTextBack) || parsed.address;

    const uidFront = findAadhaarIn(rawTextFront);
    const uidBack = findAadhaarIn(rawTextBack);
    const isUidSame = uidFront && uidBack ? uidFront === uidBack : null;

    if ((!parsed.gender || parsed.gender.length === 1) && /female/i.test(combined))
      parsed.gender = "FEMALE";

    if ((!parsed.gender || parsed.gender.length === 1) && /male/i.test(combined))
      parsed.gender = "MALE";

    return res.status(OK).json({
      status: true,
      message: MSG_PARSE_SUCCESS,
      data: { ...parsed, isUidSame },
      raw: { front: rawTextFront, back: rawTextBack },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(SERVER_ERROR).json({
      status: false,
      message: err?.message || "Server error",
    });
  }
};
