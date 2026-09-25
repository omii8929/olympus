import { Router } from 'express';
import {
  getResults,
  createOrUpdateResult,
  deleteResult,
} from '../controllers/resultController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getResults);
router.post('/', authenticateToken, requireAdmin, createOrUpdateResult);
router.delete('/:id', authenticateToken, requireAdmin, deleteResult);

export default router;
