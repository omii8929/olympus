import { Router } from 'express';
import {
  getAllEventsPayment,
  getEventPaymentPublic,
} from '../controllers/eventPaymentController';

const router = Router();

// Public payment endpoints
router.get('/', getAllEventsPayment);
router.get('/payment', getAllEventsPayment);
router.get('/:eventKey/payment', getEventPaymentPublic);

export default router;
