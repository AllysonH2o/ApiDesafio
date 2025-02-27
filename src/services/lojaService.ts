import db from '../config/database';
import { Loja } from '../models/Loja';

class LojaService {
  async createLoja(lojaData: Loja) {
    const stmt = db.prepare(
      'INSERT INTO lojas (nome, numero, email, cep) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(
      lojaData.nome,
      lojaData.numero,
      lojaData.email,
      lojaData.cep
    );
    return { id: result.lastInsertRowid, lojaData };
  }

  async getAllLojas() {
    return db.prepare('SELECT * FROM lojas').all();
  }
}

export default new LojaService();
