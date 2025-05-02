import validator from "validator";
import prisma from "../common/prisma/init.prisma.js";
import { ERROR_MESSAGES, SERVICE_BOOKING_STATUSES } from "../common/constants.js";

const serviceService = {
  checkServiceExists: async (id) => {
    console.log("checkServiceExists called with id:", id); // Debug
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      console.log("Service not found for id:", id); // Debug
      throw new Error(ERROR_MESSAGES.SERVICE_NOT_FOUND);
    }
    return service;
  },

  checkServiceBookingExists: async (id) => {
    console.log("checkServiceBookingExists called with id:", id); // Debug
    const serviceBooking = await prisma.serviceBooking.findUnique({ where: { id } });
    if (!serviceBooking) {
      console.log("Service booking not found for id:", id); // Debug
      throw new Error(ERROR_MESSAGES.SERVICE_BOOKING_NOT_FOUND);
    }
    return serviceBooking;
  },

  checkValidServiceBookingStatus: (status) => {
    if (!Object.values(SERVICE_BOOKING_STATUSES).includes(status)) {
      throw new Error(ERROR_MESSAGES.INVALID_STATUS);
    }
  },

  createService: async (req) => {
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }
    if (typeof price !== 'number' || price <= 0) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }
    return await prisma.service.create({ data: { name, category, price } });
  },

  getServiceById: async (req) => {
    const { id } = req.params;
    return await serviceService.checkServiceExists(id);
  },

  getAllServices: async () => {
    console.log("getAllServices called"); // Debug
    return await prisma.service.findMany({ orderBy: { created_at: 'desc' } });
  },

  updateService: async (req) => {
    const { id } = req.params;
    const { name, category, price } = req.body;
    await serviceService.checkServiceExists(id);
    if (price && (typeof price !== 'number' || price <= 0)) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }
    return await prisma.service.update({ where: { id }, data: { name, category, price } });
  },

  deleteService: async (req) => {
    const { id } = req.params;
    await serviceService.checkServiceExists(id);
    return await prisma.service.delete({ where: { id } });
  },

  createServiceBooking: async (req) => {
    console.log("createServiceBooking called with body:", req.body); // Debug
    const { serviceId, customerId, bookingId, quantity, status } = req.body;
    if (!serviceId || !customerId || !quantity) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }
    const service = await serviceService.checkServiceExists(serviceId);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }
    if (status) {
      serviceService.checkValidServiceBookingStatus(status);
    }
    const totalPrice = service.price * quantity;
    const serviceBooking = await prisma.serviceBooking.create({
      data: { serviceId, customerId, bookingId: bookingId || null, quantity, totalPrice, status: status || SERVICE_BOOKING_STATUSES.PENDING },
      include: { service: true },
    });
    console.log("Created service booking:", serviceBooking); // Debug
    return serviceBooking;
  },

  getServiceBookingById: async (req) => {
    const { id } = req.params;
    return await serviceService.checkServiceBookingExists(id);
  },

  getAllServiceBookings: async () => {
    console.log("getAllServiceBookings called"); // Debug
    return await prisma.serviceBooking.findMany({
      include: { service: true },
      orderBy: { created_at: 'desc' },
    });
  },

  deleteServiceBooking: async (req) => {
    const { id } = req.params;
    console.log("deleteServiceBooking called with id:", id); // Debug
    const serviceBooking = await serviceService.checkServiceBookingExists(id);
    if (serviceBooking.status === SERVICE_BOOKING_STATUSES.CANCELLED) {
      throw new Error('Đặt dịch vụ đã được hủy trước đó');
    }
    const updated = await prisma.serviceBooking.update({
      where: { id },
      data: { status: SERVICE_BOOKING_STATUSES.CANCELLED },
    });
    console.log("Updated service booking:", updated); // Debug
    return updated;
  },
};

export default serviceService;