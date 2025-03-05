import { Request, Response } from 'express';
import axios from 'axios';

import lojaService from '../services/lojaService';
import { Loja } from '../models/Loja';

class LojaController {
  createLoja(req: Request, res: Response) {
    const { nome, telefone, cep, latlon } = req.body;

    const loja = lojaService.createLoja({
      nome,
      telefone,
      cep,
      latlon,
    } as Loja);
    res.status(201).json(loja);
  }

  getAllLojas(req: Request, res: Response) {
    const lojas = lojaService.getAllLojas();

    res.status(200).json({ data: lojas });
  }

  async getLojas(req: Request, res: Response) {
    try {
      const origin = req.body.latlon;

      const lojas = lojaService.getAllLojas();

      if (lojas.length === 0)
        res.status(500).json({ message: 'Nenhuma loja cadastrada' });

      const destinations = lojas.map((loja) => `${loja.latlon}`).join('|'); //lojas maybe

      const apiKey =
        'J6gtpOgJMgsy6NzOYuRP7AA9Io3EY2nCAzIh4vgeUKB573pRs8JU6N02wfqVA6E3';

      const distanceMatrix = await axios.get(
        `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&key=${apiKey}`
      );

      const result: Partial<Loja>[] = [];

      for (let i = 0; i < lojas.length; i++) {
        const loja = {
          nome: lojas[i].nome,
          telefone: lojas[i].telefone,
          cep: lojas[i].cep,
          endereco: distanceMatrix.data.destination_addresses[i],
          distancia: distanceMatrix.data.rows[0].elements[i].distance.text,
        };
        result.push(loja);
      }

      res.status(200).json({ lojas: result });
    } catch (err) {
      res.status(404).json({ menssage: 'Nenhuma loja encontrada' });
    }
  }
}
export default new LojaController();
