import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

import logger from '../config/logger';
import lojaService from '../services/lojaService';
import { Loja } from '../models/Loja';

export async function getLatLon(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cep = req.body.cep || req.params.cep;
  try {
    const viaCep = await axios.get(`https://viacep.com.br/ws/${cep}/json`);

    const {
      logradouro: rua,
      bairro,
      localidade: cidade,
      estado,
      cep: cepViaCep,
      uf,
    } = viaCep.data;

    const endereco = `${rua.replace(/ /g, '+')},+${cidade.replace(
      / /g,
      '+'
    )},+${uf}`;

    const nominatim = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${endereco}&format=json`
    );

    req.body.endereco = { rua, bairro, cidade, estado, cepViaCep };
    req.body.latlon = `${nominatim.data[0].lat},${nominatim.data[0].lon}`;
    next();
  } catch (err) {
    logger.error(
      `Falha na api viaCep ou nominatin ao acessar o cep ${cep}, error:  ${err}`
    );
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

    if (lojasBD.length === 0) {
      logger.error(`Falha ao procurar lojas no banco de dados`);
      res
        .status(500)
        .json({ message: 'Algo deu errado, tente novamente mais tarde' });
    }

    const destinations = lojasBD.map((loja) => `${loja.latlon}`).join('|');

    const distanceMatrix = await axios.get(
      `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&key=${process.env.API_KEY}`
    );

    const lojas: Partial<Loja>[] = [];

    for (let i = 0; i < lojasBD.length; i++) {
      const loja = {
        nome: lojasBD[i].nome,
        telefone: lojasBD[i].telefone,
        rua: lojasBD[i].rua,
        bairro: lojasBD[i].bairro,
        cidade: lojasBD[i].cidade,
        estado: lojasBD[i].estado,
        cep: lojasBD[i].cep,
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
    logger.error(`Falha na api Distancematrix Error: ${err}`);
    res
      .status(500)
      .json({ message: 'Algo deu errado, tente novamente mais tarde' });
  }
}
