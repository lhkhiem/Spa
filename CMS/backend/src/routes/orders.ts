import express from 'express';
import * as orderController from '../controllers/orderController';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Public routes - create order
router.post('/', orderController.createOrder);
router.get('/number/:order_number', orderController.getOrderByNumber);

// Protected routes - require auth
router.get('/', authMiddleware, orderController.getOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id', authMiddleware, orderController.updateOrder);
router.delete('/:id', authMiddleware, orderController.deleteOrder);

export default router;

















