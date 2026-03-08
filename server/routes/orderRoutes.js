import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus, updateOrderPricing } from '../controllers/orderController.js';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminOnly.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/create', protect, upload.array('files', 5), createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/all-orders', protect, getAllOrders);
router.patch('/:orderId/status', protect, updateOrderStatus);
router.patch('/:orderId/pricing', protect, isAdmin, updateOrderPricing);

export default router;
