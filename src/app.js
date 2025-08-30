import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pino from 'pino-http';
import api from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import docsRouter from './routes/docs.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(pino());
app.use(rateLimit({ windowMs: 60_000, max: 200 }));

app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.use('/docs', docsRouter);
app.use('/api', api);

app.use(notFound);
app.use(errorHandler);

export default app;


