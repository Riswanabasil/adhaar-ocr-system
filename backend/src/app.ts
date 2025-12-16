import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import rateLimit from 'express-rate-limit';
import aadharRoutes from './routes/aadharRoutes';
import { CORS_ORIGIN } from './config/index';
import { notFound, errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(helmet());

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60 * 1000, max: 60 })); 

app.use('/api', aadharRoutes);

app.get('/', (_req, res) => res.json({ ok: true, message: 'Aadhaar OCR API' }));

app.use(notFound);
app.use(errorHandler);

export default app;