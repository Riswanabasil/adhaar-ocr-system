import { Request } from "express";

export interface MulterRequest extends Request {
  files: {
    front: Express.Multer.File[];
    back: Express.Multer.File[];
  };
}
