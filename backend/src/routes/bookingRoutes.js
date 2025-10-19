import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', requireAuth, bookingController.createBooking);
router.get('/', requireAuth, bookingController.listBookings);
router.get('/:id', requireAuth, bookingController.getBooking);
router.post('/:id/cancel', requireAuth, bookingController.cancelBooking);

export default router;
