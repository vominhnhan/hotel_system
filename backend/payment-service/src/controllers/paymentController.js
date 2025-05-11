// payment-service/controllers/paymentController.js
import paymentService from '../services/paymentService.js';
import { ERROR_MESSAGES } from '../common/constants.js';

const paymentController = {
  // Tạo thanh toán mới
  createPayment: async (req, res) => {
    try {
      const payment = await paymentService.createPayment(req.body);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Lấy thông tin thanh toán theo ID
  getPaymentById: async (req, res) => {
    console.log('Calling getPaymentById with params:', req.params);
    try {
      const payment = await paymentService.getPaymentById(req.params.id);
      res.status(200).json(payment);
    } catch (error) {
      res.status(error.message === ERROR_MESSAGES.PAYMENT_NOT_FOUND ? 404 : 500).json({ error: error.message });
    }
  },

  // Lấy danh sách tất cả thanh toán
  getAllPayments: async (req, res) => {
    console.log('Controller: getAllPayments called');
    try {
      const payments = await paymentService.getAllPayments();
      res.status(200).json(payments);
    } catch (error) {
      console.log('Error in getAllPayments:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật thanh toán
  updatePayment: async (req, res) => {
    try {
      const payment = await paymentService.updatePayment(req.params.id, req.body);
      res.status(200).json(payment);
    } catch (error) {
      res.status(error.message === ERROR_MESSAGES.PAYMENT_NOT_FOUND ? 404 : 400).json({ error: error.message });
    }
  },

  // Xóa thanh toán
  deletePayment: async (req, res) => {
    try {
      await paymentService.deletePayment(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(error.message === ERROR_MESSAGES.PAYMENT_NOT_FOUND ? 404 : 500).json({ error: error.message });
    }
  },

  // Tạo hóa đơn mới (có xử lý tệp đính kèm)
  createInvoice: async (req, res) => {
    try {
      const data = {
        ...req.body,
        attachment: req.file ? `/uploads/${req.file.filename}` : null, // Lưu đường dẫn tệp
      };
      const invoice = await paymentService.createInvoice(data);
      res.status(201).json(invoice);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Lấy thông tin hóa đơn theo ID
  getInvoiceById: async (req, res) => {
    console.log('Calling getInvoiceById with params:', req.params);
    try {
      const invoice = await paymentService.getInvoiceById(req.params.id);
      res.status(200).json(invoice);
    } catch (error) {
      res.status(error.message === ERROR_MESSAGES.INVOICE_NOT_FOUND ? 404 : 500).json({ error: error.message });
    }
  },

  // Lấy danh sách tất cả hóa đơn
  getAllInvoices: async (req, res) => {
    console.log('Controller: getAllInvoices called');
    try {
      const invoices = await paymentService.getAllInvoices();
      res.status(200).json(invoices);
    } catch (error) {
      console.log('Error in getAllInvoices:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật hóa đơn (có xử lý tệp đính kèm)
  updateInvoice: async (req, res) => {
    try {
      const data = {
        ...req.body,
        attachment: req.file ? `/uploads/${req.file.filename}` : req.body.attachment, // Cập nhật đường dẫn nếu có tệp mới
      };
      const invoice = await paymentService.updateInvoice(req.params.id, data);
      res.status(200).json(invoice);
    } catch (error) {
      res.status(error.message === ERROR_MESSAGES.INVOICE_NOT_FOUND ? 404 : 400).json({ error: error.message });
    }
  },

  // Xóa hóa đơn
  deleteInvoice: async (req, res) => {
    try {
      await paymentService.deleteInvoice(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(error.message === ERROR_MESSAGES.INVOICE_NOT_FOUND ? 404 : 500).json({ error: error.message });
    }
  },

  // Tạo chi tiết hóa đơn mới
  createInvoiceItem: async (req, res) => {
    try {
      const item = await paymentService.createInvoiceItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Lấy danh sách chi tiết hóa đơn theo invoice_id
  getInvoiceItemsByInvoiceId: async (req, res) => {
    console.log('Calling getInvoiceItemsByInvoiceId with params:', req.params);
    try {
      const items = await paymentService.getInvoiceItemsByInvoiceId(req.params.id);
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default paymentController;