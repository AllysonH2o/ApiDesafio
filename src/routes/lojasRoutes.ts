import { Router } from 'express';
import { getLatLon, getDistancias } from '../middlewares/apiMiddleware';

import LojaController from '../controllers/lojasController';

const router = Router();

router.route('/').post(getLatLon, LojaController.createLoja);

router
  .route('/:cep')
  .get(getLatLon, getDistancias, LojaController.getLojas100Km);

router
  .route('/proxima/:cep')
  .get(getLatLon, getDistancias, LojaController.getAllLojas);

export default router;
