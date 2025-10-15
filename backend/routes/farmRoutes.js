import express from 'express';
import {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
} from '../controllers/farmController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getFarms).post(protect, createFarm);
router.route('/:id').get(protect, getFarmById).put(protect, updateFarm).delete(protect, deleteFarm);

export default router;
