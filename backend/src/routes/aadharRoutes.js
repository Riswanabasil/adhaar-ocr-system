import { Router } from 'express';
import { health } from '../controllers/aadharController.js';
import { upload } from '../utils/parseUtils.js';
import { validateFiles } from '../middlewares/validateFiles.js';
import { parseImmediate } from '../controllers/aadharController.js';

const router = Router();

router.get('/health', health);

router.post(
    '/parse',
    upload.fields([
        { name: 'front', maxCount: 1 },
        { name: 'back', maxCount: 1 },
    ]),
    validateFiles,
    parseImmediate
);

export default router;
