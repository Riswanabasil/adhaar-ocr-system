import { BAD_REQUEST } from '../constants/statusCodes.js';
import { MSG_MISSING_FILES, MSG_INVALID_FILETYPE } from '../constants/messages.js';

const ALLOWED = new Set(['image/jpeg', 'image/png']);

export const validateFiles = (req, res, next) => {
  const files = req.files || {};
  const front = files.front?.[0];
  const back = files.back?.[0];

  if (!front || !back) {
    return res.status(BAD_REQUEST).json({
      status: false,
      message: MSG_MISSING_FILES,
      errors: {
        front: front ? undefined : 'missing',
        back: back ? undefined : 'missing',
      },
    });
  }

  if (!ALLOWED.has(front.mimetype) || !ALLOWED.has(back.mimetype)) {
    return res.status(BAD_REQUEST).json({
      status: false,
      message: MSG_INVALID_FILETYPE,
    });
  }

  return next();
};
