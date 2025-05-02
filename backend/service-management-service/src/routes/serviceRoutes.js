import express from 'express';
import serviceController from '../controllers/serviceController.js';
import { validateService, validateServiceBooking } from '../middlewares/validateService.js';

const router = express.Router();

// Routes cho dịch vụ (Service)
router.post('/', validateService, serviceController.createService);
router.get('/', serviceController.getAllServices);

// Routes cho đặt dịch vụ (ServiceBooking) - Đặt trước route động /:id
router.post('/bookings', validateServiceBooking, serviceController.createServiceBooking);
router.get('/bookings', serviceController.getAllServiceBookings);
router.get('/bookings/:id', serviceController.getServiceBookingById);
router.delete('/bookings/:id', serviceController.deleteServiceBooking);

// Route động cho dịch vụ theo ID
router.get('/:id', serviceController.getServiceById);
router.put('/:id', validateService, serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

export default router;