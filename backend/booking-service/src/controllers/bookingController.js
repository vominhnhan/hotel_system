import { responseError, responseSuccess } from "../common/helpers/response.helper.js";
import bookingService from "../services/bookingService.js";
import { ERROR_MESSAGES } from "../common/constants.js";

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const booking = await bookingService.createBooking(req.body);
      const resData = responseSuccess(booking, "Tạo booking thành công", 201);
      return res.status(resData.code).json(resData);
    } catch (error) {
      console.error(error);
      const resData = responseError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS, 400);
      return res.status(resData.code).json(resData);
    }
  },

  getBookingById: async (req, res) => {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      if (!booking) {
        const resData = responseError(ERROR_MESSAGES.BOOKING_NOT_FOUND, 404);
        return res.status(resData.code).json(resData);
      }
      const resData = responseSuccess(booking, "Lấy thông tin booking thành công", 200);
      return res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      return res.status(resData.code).json(resData);
    }
  },

  getAllBookings: async (req, res) => {
    try {
      const bookings = await bookingService.getAllBookings();
      const resData = responseSuccess(bookings, "Lấy danh sách booking thành công", 200);
      return res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      return res.status(resData.code).json(resData);
    }
  },

  updateBooking: async (req, res) => {
    try {
      const booking = await bookingService.updateBooking(req.params.id, req.body);
      if (!booking) {
        const resData = responseError(ERROR_MESSAGES.BOOKING_NOT_FOUND, 404);
        return res.status(resData.code).json(resData);
      }
      const resData = responseSuccess(booking, "Cập nhật thông tin booking thành công", 200);
      return res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 400);
      return res.status(resData.code).json(resData);
    }
  },

  deleteBooking: async (req, res) => {
    try {
      const result = await bookingService.deleteBooking(req.params.id);
      if (!result) {
        const resData = responseError(ERROR_MESSAGES.BOOKING_NOT_FOUND, 404);
        return res.status(resData.code).json(resData);
      }
      const resData = responseSuccess(result, "Xóa booking thành công", 204);
      return res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 500);
      return res.status(resData.code).json(resData);
    }
  },
};

export default bookingController;