const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const validateBooking = require('../middlewares/validateBooking');

router.post('/', validateBooking, bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;