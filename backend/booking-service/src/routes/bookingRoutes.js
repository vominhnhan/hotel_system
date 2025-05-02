import express from 'express';
import bookingController from '../controllers/bookingController.js';
import validateBooking from '../middlewares/validateBooking.js';

const router = express.Router();

router.post('/', validateBooking, bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

export default router;
