// import { NOT_FOUND, SERVER_ERROR } from '../constants/statusCodes';

// export const notFound = (req, res, next) => {
//   const err = new Error(`Not Found - ${req.originalUrl}`);
//   err.status = NOT_FOUND;
//   next(err);
// };

// export const errorHandler = (err, _req, res, _next) => {
//   const status = err.status || SERVER_ERROR;
//   const message = err.message || 'Internal Server Error';
//   res.status(status).json({ status: false, message });
// };

import { Request, Response, NextFunction } from "express";
import { NOT_FOUND, SERVER_ERROR } from "../constants/statusCodes";

// Extend Error object to include "status"
interface HttpError extends Error {
  status?: number;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err: HttpError = new Error(`Not Found - ${req.originalUrl}`);
  err.status = NOT_FOUND;
  next(err);
};

export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    status: false,
    message
  });
};

