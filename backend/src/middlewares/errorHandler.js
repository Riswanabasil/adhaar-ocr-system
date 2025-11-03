import { NOT_FOUND, SERVER_ERROR } from '../constants/statusCodes.js';

export const notFound = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  err.status = NOT_FOUND;
  next(err);
};

export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ status: false, message });
};
