import { Request, Response } from 'express';
import axios from 'axios';

import lojaService from '../services/lojaService';
import { Loja } from '../models/Loja';

class LojaController {
  async createLoja(req: Request, res: Response) {
    const { nome, numero, email, cep } = req.body;

    const viaCep = await axios.get(`https://viacep.com.br/ws/${cep}/json`);

    const { logradouro: rua, bairro, localidade: cidade, uf } = viaCep.data;

    const endereco = `${rua.replace(/ /g, '+')},+${cidade.replace(
      / /g,
      '+'
    )},+${uf}`;

    const nominatim = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${endereco}&format=json`
    );

    const { lat, lon } = nominatim.data[0];

    const loja = lojaService.createLoja({
      nome,
      numero,
      email,
      cep,
      uf,
      cidade,
      bairro,
      rua,
      lat,
      lon,
    } as Loja);
    res.status(201).json(loja);
  }

  getAllLojas(req: Request, res: Response) {
    const loja = lojaService.getAllLojas();

    res.status(200).json({ data: loja });
  }

  async getLojas(req: Request, res: Response) {
    const { cep } = req.params;

    const viaCep = await axios.get(`https://viacep.com.br/ws/${cep}/json`);

    const { logradouro: rua, localidade: cidade, uf } = viaCep.data;

    const endereco = `${rua.replace(/ /g, '+')},+${cidade.replace(
      / /g,
      '+'
    )},+${uf}`;

    const nominatim = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${endereco}&format=json`
    );

    const origin = nominatim.data[0].lat + ',' + nominatim.data[0].lon;

    const loja = lojaService.getAllLojas();

    const destinations = loja
      .map((loja) => `${loja.lat},${loja.lon}`)
      .join('|');

    const apiKey =
      'J6gtpOgJMgsy6NzOYuRP7AA9Io3EY2nCAzIh4vgeUKB573pRs8JU6N02wfqVA6E3';

    const distanceMatrix = await axios.get(
      `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&key=${apiKey}`
    );

    res.status(200).json({ loja: loja, distancia: distanceMatrix.data });
  }
}
export default new LojaController();
