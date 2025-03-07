import path from 'path';
import Database from 'better-sqlite3';

import logger from './logger';

const dbPath = path.resolve(__dirname, '../../bd.sqlite');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS lojas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone INTEGER UNIQUE NOT NULL,
    rua TEXT NOT NULL,
    bairro TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL,
    cep TEXT NOT NULL,
    latlon TEXT NOT NULL
  );
`);

logger.info('Conectado com o Banco de dados');

export default db;
