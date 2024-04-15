
import express from 'express';
import { processarOrdem } from '../controllers/order.mjs';

const router = express.Router();

router.post('/orderaccumulator/ordem', processarOrdem);

export { router };
