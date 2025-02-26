import { Router } from 'express';
import { getLojas } from '../controllers/lojasController';

const router = Router();

router.route('/:cep').get(getLojas);

export default router;
