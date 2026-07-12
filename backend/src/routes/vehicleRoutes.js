import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import {
    createVehicle,
    getVehicles,
    searchVehicles,
    updateVehicle,
    deleteVehicle,
    purchaseVehicle,
    restockVehicle
} from '../controllers/vehicleController.js';

const router = express.Router();

router.get('/search', protect, searchVehicles);

router.post('/', protect, createVehicle);
router.get('/', protect, getVehicles);
router.put('/:id', protect, updateVehicle);
router.delete('/:id', protect, admin, deleteVehicle);

router.post('/:id/purchase', protect, purchaseVehicle);
router.post('/:id/restock', protect, admin, restockVehicle);

export default router;
