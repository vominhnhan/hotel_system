import serviceService from "../services/serviceService.js";
import { ERROR_MESSAGES } from "../common/constants.js";

const serviceController = {

  // Tạo dịch vụ mới
  createService: async (req, res) => {
    try {
      const service = await serviceService.createService(req);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Lấy dịch vụ theo ID
 getServiceById: async (req, res) => {
    console.log("Calling getServiceById with params:", req.params); // Debug
    try {
      const service = await serviceService.getServiceById(req);
      res.status(200).json(service);
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.SERVICE_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  // Lấy tất cả dịch vụ
  getAllServices: async (req, res) => {
    try {
      const services = await serviceService.getAllServices();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật dịch vụ theo ID
  updateService: async (req, res) => {
    try {
      const service = await serviceService.updateService(req);
      res.status(200).json(service);
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.SERVICE_NOT_FOUND) ? 404 : 400).json({ error: error.message });
    }
  },

  // Xóa dịch vụ theo ID
  deleteService: async (req, res) => {
    try {
      await serviceService.deleteService(req);
      res.status(204).send();
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.SERVICE_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  // Tạo đặt dịch vụ mới
  createServiceBooking: async (req, res) => {
    try {
      const serviceBooking = await serviceService.createServiceBooking(req);
      res.status(201).json(serviceBooking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Lấy đặt dịch vụ theo ID
  getServiceBookingById: async (req, res) => {
    try {
      const serviceBooking = await serviceService.getServiceBookingById(req);
      res.status(200).json(serviceBooking);
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.SERVICE_BOOKING_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  // Lấy tất cả đặt dịch vụ
  getAllServiceBookings: async (req, res) => {
    console.log("Controller: getAllServiceBookings called"); // Debug
    try {
      const serviceBookings = await serviceService.getAllServiceBookings();
      res.status(200).json(serviceBookings);
    } catch (error) {
      console.log("Error in getAllServiceBookings:", error.message); // Debug
      res.status(500).json({ error: error.message });
    }
  },

  // Hủy đặt dịch vụ
  deleteServiceBooking: async (req, res) => {
    try {
      await serviceService.deleteServiceBooking(req);
      res.status(204).send();
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.SERVICE_BOOKING_NOT_FOUND) ? 404 : 400).json({ error: error.message });
    }
  },
};

export default serviceController;