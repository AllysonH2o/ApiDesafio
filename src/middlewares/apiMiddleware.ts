import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export async function getLatLon(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cep = req.body.cep || req.params.cep;

    const viaCep = await axios.get(`https://viacep.com.br/ws/${cep}/json`);

    const { logradouro, localidade, uf } = viaCep.data;

    const endereco = `${logradouro.replace(/ /g, '+')},+${localidade.replace(
      / /g,
      '+'
    )},+${uf}`;

    const nominatim = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${endereco}&format=json`
    );

    req.body.latlon = `${nominatim.data[0].lat},${nominatim.data[0].lon}`;
    next();
  } catch (err) {
    res.status(400).json({ menssage: 'cep inválido' });
  }
}
