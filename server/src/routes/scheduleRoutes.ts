import { Router } from 'express';
import {
  getSchedule,
  createScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
} from '../controllers/scheduleController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getSchedule);
router.post('/', authenticateToken, requireAdmin, createScheduleItem);
router.put('/:id', authenticateToken, requireAdmin, updateScheduleItem);
router.delete('/:id', authenticateToken, requireAdmin, deleteScheduleItem);

export default router;
