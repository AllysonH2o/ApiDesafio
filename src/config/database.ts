import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.resolve(__dirname, '../../bd.sqlite');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS lojas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone INTEGER UNIQUE NOT NULL,
    cep INTEGER NOT NULL,
    latlon TEXT NOT NULL
  );
`);

export default db;
