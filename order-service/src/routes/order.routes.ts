import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

const router = Router();

router.post('/orders', OrderController.createOrder);
router.get('/orders', OrderController.getAllOrders);

export default router;
