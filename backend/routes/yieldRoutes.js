import express from 'express';
import {
  getYields,
  getYieldById,
  createYield,
  updateYield,
  deleteYield,
} from '../controllers/yieldController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getYields).post(protect, createYield);
router.route('/:id').get(protect, getYieldById).put(protect, updateYield).delete(protect, deleteYield);

export default router;
