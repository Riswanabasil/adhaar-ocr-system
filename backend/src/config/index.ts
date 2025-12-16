import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
