import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

import lojaService from '../services/lojaService';
import { Loja } from '../models/Loja';

export async function getLatLon(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cep = req.body.cep || req.params.cep;

    const viaCep = await axios.get(`https://viacep.com.br/ws/${cep}/json`);

    const { logradouro, localidade, uf, bairro } = viaCep.data;

    const endereco = `${logradouro.replace(/ /g, '+')},+${localidade.replace(
      / /g,
      '+'
    )},+${uf}`;

    const nominatim = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${endereco}&format=json`
    );

    req.body.endereco = `${logradouro}, ${bairro}, ${localidade} - ${uf}, ${viaCep.data.cep}`;
    req.body.latlon = `${nominatim.data[0].lat},${nominatim.data[0].lon}`;
    next();
  } catch (err) {
    res.status(400).json({ message: 'cep inválido' });
  }
}

export async function getDistancias(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const origin = req.body.latlon;

    const lojasBD = lojaService.getAllLojas();

    if (lojasBD.length === 0)
      res
        .status(500)
        .json({ message: 'Algo deu errado, tente novamente mais tarde' });

    const destinations = lojasBD.map((loja) => `${loja.latlon}`).join('|');

    const distanceMatrix = await axios.get(
      `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&key=${process.env.API_KEY}`
    );

    const lojas: Partial<Loja>[] = [];

    for (let i = 0; i < lojasBD.length; i++) {
      const loja = {
        nome: lojasBD[i].nome,
        telefone: lojasBD[i].telefone,
        endereco: lojasBD[i].endereco,
        distancia: distanceMatrix.data.rows[0].elements[i].distance.text,
        distanciaValue: distanceMatrix.data.rows[0].elements[i].distance.value,
      };
      lojas.push(loja);
    }

    req.body.lojas = [...lojas].sort(
      (a, b) => a.distanciaValue! - b.distanciaValue!
    );

    next();
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Algo deu errado, tente novamente mais tarde' });
  }
}
