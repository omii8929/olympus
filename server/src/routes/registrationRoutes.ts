import { Router } from 'express';
import { registerTeam, getRegistrationByCode } from '../controllers/registrationController';

const router = Router();

router.post('/', registerTeam);
router.get('/:code', getRegistrationByCode);

export default router;
