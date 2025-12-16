import { Router } from 'express';
import { health } from '../controllers/aadharController';
import { upload } from '../utils/parseUtils';
import { validateFiles } from '../middlewares/validateFiles';
import { parseImmediate } from '../controllers/aadharController';

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
