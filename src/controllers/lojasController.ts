import { Request, Response } from 'express';
import lojaService from '../services/lojaService';
import { Loja } from '../models/Loja';

class LojaController {
  async createLoja(req: Request, res: Response) {
    const { nome, numero, email, cep } = req.body;
    const loja = await lojaService.createLoja({
      nome,
      numero,
      email,
      cep,
    } as Loja);

    res.status(201).json(loja);
  }

  async getAllLojas(req: Request, res: Response) {
    const { cep } = req.params;
    const loja = await lojaService.getAllLojas();

    res.status(200).json({ data: loja, cep: cep });
  }
}
export default new LojaController();
