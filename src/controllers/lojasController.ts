import { Request, Response } from 'express';
import axios from 'axios';

import lojaService from '../services/lojaService';
import { Loja } from '../models/Loja';

class LojaController {
  async createLoja(req: Request, res: Response) {
    const { nome, numero, email, cep } = req.body;

    const viaCep = await axios.get(`https://viacep.com.br/ws/${cep}/json`);

    const {
      logradouro: endereco,
      bairro,
      localidade: cidade,
      uf,
    } = viaCep.data;

    const loja = lojaService.createLoja({
      nome,
      numero,
      email,
      cep,
      uf,
      cidade,
      bairro,
      endereco,
    } as Loja);
    res.status(201).json(viaCep.data);
  }

  getAllLojas(req: Request, res: Response) {
    const { cep } = req.params;
    const loja = lojaService.getAllLojas();

    res.status(200).json({ data: loja, cep: cep });
  }
}
export default new LojaController();
