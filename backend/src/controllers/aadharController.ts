
// import { Request, Response } from "express";
// import multer from "multer";

// import {
//   MSG_HEALTH_OK,
//   MSG_PARSE_SUCCESS
// } from "../constants/messages";
// import { OK, SERVER_ERROR } from "../constants/statusCodes";
// import { preprocessBuffer } from "../services/imageService";
// import { recognizeText } from "../services/ocrService";
// import {
//   extractAddressFromBack,
//   extractNameFromFront,
//   findAadhaarIn,
//   parseAadhaarData
// } from "../utils/parseUtils";

// // CORRECT TYPE for Multer files
// interface MulterRequest extends Request {
//   files: {
//     front: Express.Multer.File[];
//     back: Express.Multer.File[];
//   };
// }

// export const health = (_req: Request, res: Response) => {
//   return res.status(OK).json({ status: true, message: MSG_HEALTH_OK });
// };

// export const parseImmediate = async (req: MulterRequest, res: Response) => {
//   try {
//     const front = req.files?.front?.[0];
//     const back = req.files?.back?.[0];

//     if (!front || !back) {
//       return res
//         .status(SERVER_ERROR)
//         .json({ status: false, message: "Files missing" });
//     }

//     const [frontBuf, backBuf] = await Promise.all([
//       preprocessBuffer(front.buffer),
//       preprocessBuffer(back.buffer),
//     ]);

//     const [frontOCR, backOCR] = await Promise.all([
//       recognizeText(frontBuf),
//       recognizeText(backBuf),
//     ]);

//     const rawTextFront = frontOCR?.data?.text || "";
//     const rawTextBack = backOCR?.data?.text || "";
//     const combined = `${rawTextFront}\n${rawTextBack}`;

//     const parsed = parseAadhaarData(combined);

//     parsed.name = extractNameFromFront(rawTextFront) || parsed.name;
//     parsed.address = extractAddressFromBack(rawTextBack) || parsed.address;

//     const uidFront = findAadhaarIn(rawTextFront);
//     const uidBack = findAadhaarIn(rawTextBack);
//     const isUidSame = uidFront && uidBack ? uidFront === uidBack : null;

//     if ((!parsed.gender || parsed.gender.length === 1) && /female/i.test(combined))
//       parsed.gender = "FEMALE";

//     if ((!parsed.gender || parsed.gender.length === 1) && /male/i.test(combined))
//       parsed.gender = "MALE";

//     return res.status(OK).json({
//       status: true,
//       message: MSG_PARSE_SUCCESS,
//       data: { ...parsed, isUidSame },
//       raw: { front: rawTextFront, back: rawTextBack },
//     });
//   } catch (err: any) {
//     console.error(err);
//     return res.status(SERVER_ERROR).json({
//       status: false,
//       message: err?.message || "Server error",
//     });
//   }
// };


import { Request, Response } from "express";
import { MSG_HEALTH_OK, MSG_PARSE_SUCCESS } from "../constants/messages";
import { OK, SERVER_ERROR } from "../constants/statusCodes";
import ImageService from "../services/imageService";
import OcrService from "../services/ocrService";
import {
  extractAddressFromBack,
  extractNameFromFront,
  findAadhaarIn,
  parseAadhaarData
} from "../utils/parseUtils";
import { MulterRequest } from "../types/multer";

class AadharController {
  public health(req: Request, res: Response) {
    return res.status(OK).json({
      status: true,
      message: MSG_HEALTH_OK,
    });
  }

  public async parseImmediate(req: MulterRequest, res: Response) {
    try {
      const front = req.files.front[0];
      const back = req.files.back[0];

      const frontBuf = await ImageService.preprocess(front.buffer);
      const backBuf = await ImageService.preprocess(back.buffer);

      const frontOCR = await OcrService.recognize(frontBuf);
      const backOCR = await OcrService.recognize(backBuf);

      const rawTextFront = frontOCR.data.text || "";
      const rawTextBack = backOCR.data.text || "";
      const combined = `${rawTextFront}\n${rawTextBack}`;

      const parsed = parseAadhaarData(combined);

      parsed.name = extractNameFromFront(rawTextFront) || parsed.name;
      parsed.address = extractAddressFromBack(rawTextBack) || parsed.address;

      const uidFront = findAadhaarIn(rawTextFront);
      const uidBack = findAadhaarIn(rawTextBack);

      const isUidSame =
        uidFront && uidBack ? uidFront === uidBack : null;

      if ((!parsed.gender || parsed.gender.length === 1) && /female/i.test(combined)) {
        parsed.gender = "FEMALE";
      }

      if ((!parsed.gender || parsed.gender.length === 1) && /male/i.test(combined)) {
        parsed.gender = "MALE";
      }

      return res.status(OK).json({
        status: true,
        message: MSG_PARSE_SUCCESS,
        data: { ...parsed, isUidSame },
        raw: { front: rawTextFront, back: rawTextBack },
      });

    } catch (err: any) {
      return res.status(SERVER_ERROR).json({
        status: false,
        message: err.message || "Server error",
      });
    }
  }
}

export default new AadharController();
