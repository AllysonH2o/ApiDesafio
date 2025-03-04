import db from '../config/database';
import { Loja } from '../models/Loja';

class LojaService {
  createLoja(lojaData: Loja) {
    const stmt = db.prepare(
      'INSERT INTO lojas (nome, numero, email, cep, uf, cidade, bairro, rua, lat, lon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      lojaData.nome,
      lojaData.numero,
      lojaData.email,
      lojaData.cep,
      lojaData.uf,
      lojaData.cidade,
      lojaData.bairro,
      lojaData.rua,
      lojaData.lat,
      lojaData.lon
    );
    return { id: result.lastInsertRowid, lojaData };
  }

  getAllLojas() {
    return db.prepare('SELECT * FROM lojas').all() as Loja[];
  }
}

export default new LojaService();
