import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.resolve(__dirname, '../../bd.sqlite');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS lojas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    numero INTEGER UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    cep INTEGER NOT NULL
  );
`);

export default db;
