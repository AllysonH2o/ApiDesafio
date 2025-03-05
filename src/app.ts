import express from 'express';
import lojasRouter from './routes/lojasRoutes';

const app = express();

app.use(express.json());

app.use('/api/', lojasRouter);

export default app;
