import { Router } from 'express';
import { getLatLon } from '../middlewares/apiMiddleware';

import LojaController from '../controllers/lojasController';

const router = Router();

router
  .route('/')
  .get(LojaController.getAllLojas)
  .post(getLatLon, LojaController.createLoja);

router.route('/:cep').get(getLatLon, LojaController.getLojas);

export default router;
