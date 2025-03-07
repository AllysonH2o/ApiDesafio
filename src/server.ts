import dotenv from 'dotenv';

import app from './app';
import logger from './config/logger';

dotenv.config();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Servidor rodando na porta ${port}`);
});
