import { Router } from 'express';

import LojaController from '../controllers/lojasController';

const router = Router();

router
  .route('/')
  .get(LojaController.getAllLojas)
  .post(LojaController.createLoja);

router.route('/:cep').get(LojaController.getLojas);

export default router;
