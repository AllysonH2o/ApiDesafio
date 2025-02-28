import { Router } from 'express';

import LojaController from '../controllers/lojasController';

const router = Router();

router.route('/').post(LojaController.createLoja);

router.route('/:cep').get(LojaController.getAllLojas);

export default router;
