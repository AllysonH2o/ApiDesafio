import express from 'express';
import dotenv from 'dotenv';
import lojasRouter from './routes/lojasRoutes';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/', lojasRouter);

export default app;
