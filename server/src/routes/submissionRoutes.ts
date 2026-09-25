import { Router } from 'express';
import { submitProject, getAllSubmissions } from '../controllers/submissionController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/', submitProject);
router.get('/', authenticateToken, requireAdmin, getAllSubmissions);

export default router;
