import express from 'express';
import { createService, deleteService, getAllServices, updateService } from '../controllers/serviceController.js';
import isAdmin from '../middleware/adminOnly.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect ,isAdmin, createService);
router.get('/', getAllServices)
router.put('/:id', protect, isAdmin, updateService)
router.delete('/:id', protect, isAdmin, deleteService)

export default router;