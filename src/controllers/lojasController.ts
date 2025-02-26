import { RequestHandler } from 'express';

export const getLojas: RequestHandler = (req, res, next) => {
  const { cep } = req.params;
  console.log(cep);

  res.status(200).json({ message: 'cep recebido', cep: cep });
};
