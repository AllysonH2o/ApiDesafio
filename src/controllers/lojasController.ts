import { Request, Response } from 'express';

import lojaService from '../services/lojaService';
import { Loja } from '../models/Loja';

class LojaController {
  createLoja(req: Request, res: Response) {
    const { nome, telefone, latlon } = req.body;

    const { rua, bairro, cidade, estado, cepViaCep: cep } = req.body.endereco;

    const loja = lojaService.createLoja({
      nome,
      telefone,
      rua,
      bairro,
      cidade,
      estado,
      cep,
      latlon,
    } as Loja);
    res.status(201).json(loja);
  }

  getAllLojas(req: Request, res: Response) {
    const lojas: Partial<Loja>[] = req.body.lojas;

    lojas.forEach((loja) => delete loja.distanciaValue);

    res.status(200).json({ lojas: lojas });
  }

  async getLojas100Km(req: Request, res: Response) {
    const lojas: Partial<Loja>[] = req.body.lojas;

    const lojasFiltradas = lojas.filter(
      (loja) => loja.distanciaValue! <= 100000
    );

    if (lojasFiltradas.length === 0)
      res
        .status(404)
        .json({ message: 'Nenhuma loja encontrada no raio de 100 km' });

    lojasFiltradas.forEach((loja) => delete loja.distanciaValue);

    res.status(200).json({ lojas: lojasFiltradas });
  }
}
export default new LojaController();
