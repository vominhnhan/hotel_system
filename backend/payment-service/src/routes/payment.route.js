// payment-service/routes/payment_route.js
import express from 'express';
import paymentController from '../controllers/paymentController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import multer from 'multer';

// Cấu hình multer để lưu tệp vào thư mục 'uploads/'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép tệp PDF hoặc hình ảnh!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const router = express.Router();

// Áp dụng authMiddleware cho tất cả các route
router.use(authMiddleware);

// Routes cho Payment
router.post('/payments', authorizeRoles('MANAGER'), paymentController.createPayment);
router.get('/payments', paymentController.getAllPayments);
router.get('/payments/:id', paymentController.getPaymentById);
router.put('/payments/:id', authorizeRoles('MANAGER'), paymentController.updatePayment);
router.delete('/payments/:id', authorizeRoles('MANAGER'), paymentController.deletePayment);

// Routes cho Invoice
router.post('/invoices', upload.single('attachment'), authorizeRoles('MANAGER'), paymentController.createInvoice);
router.get('/invoices', paymentController.getAllInvoices);
router.get('/invoices/:id', paymentController.getInvoiceById);
router.put('/invoices/:id', upload.single('attachment'), authorizeRoles('MANAGER'), paymentController.updateInvoice);
router.delete('/invoices/:id', authorizeRoles('MANAGER'), paymentController.deleteInvoice);

export default router;