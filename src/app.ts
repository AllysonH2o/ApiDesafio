import express from 'express';
import lojasRouter from './routes/lojasRoutes';

const app = express();

app.use('/', lojasRouter);

export default app;
