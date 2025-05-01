const bookingService = require('../services/bookingService');
const { ERROR_MESSAGES } = require('../common/constants');

const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS, details: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: ERROR_MESSAGES.BOOKING_NOT_FOUND });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    if (!booking) {
      return res.status(404).json({ error: ERROR_MESSAGES.BOOKING_NOT_FOUND });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const result = await bookingService.deleteBooking(req.params.id);
    if (!result) {
      return res.status(404).json({ error: ERROR_MESSAGES.BOOKING_NOT_FOUND });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking,
};