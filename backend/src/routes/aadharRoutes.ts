// import { Router } from 'express';
// import { health } from '../controllers/aadharController';
// import { upload } from '../utils/parseUtils';
// import { validateFiles } from '../middlewares/validateFiles';
// import { parseImmediate } from '../controllers/aadharController';

// const router = Router();

// router.get('/health', health);

// router.post(
//     '/parse',
//     upload.fields([
//         { name: 'front', maxCount: 1 },
//         { name: 'back', maxCount: 1 },
//     ]),
//     validateFiles,
//     parseImmediate
// );

// export default router;

import { Router } from "express";
import AadharController from "../controllers/aadharController";
import { upload } from "../utils/parseUtils";
import { validateFiles } from "../middlewares/validateFiles";

const router = Router();

// GET /health
router.get("/health", AadharController.health.bind(AadharController));

// POST /parse
router.post(
  "/parse",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  validateFiles,
  AadharController.parseImmediate.bind(AadharController)
);

export default router;
