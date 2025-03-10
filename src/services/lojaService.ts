import db from '../config/database';
import { Loja } from '../models/Loja';

class LojaService {
  createLoja(lojaData: Loja) {
    const stmt = db.prepare(
      'INSERT INTO lojas (nome, telefone, rua, bairro, cidade, estado, cep, latlon) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      lojaData.nome,
      lojaData.telefone,
      lojaData.rua,
      lojaData.bairro,
      lojaData.cidade,
      lojaData.estado,
      lojaData.cep,
      lojaData.latlon
    );
    return { id: result.lastInsertRowid, lojaData };
  }

  getAllLojas() {
    return db.prepare('SELECT * FROM lojas').all() as Loja[];
  }
}

export default new LojaService();
