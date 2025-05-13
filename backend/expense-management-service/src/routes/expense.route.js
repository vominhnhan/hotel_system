import express from 'express';
import expenseController from '../controllers/expenseController.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import multer from 'multer';

// Cấu hình multer để lưu tệp vào thư mục 'uploads/'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Thư mục lưu tệp
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`); // Đặt tên tệp duy nhất
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép các tệp PDF hoặc hình ảnh
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép tệp PDF hoặc hình ảnh!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn kích thước tệp: 5MB
});

const router = express.Router();

// Áp dụng authMiddleware cho tất cả các route
router.use(authMiddleware);

// Routes cho nhóm loại chi (ExpenseCategory) - Chỉ MANAGER mới được tạo, sửa, xóa
router.post('/categories', authorizeRoles("MANAGER"), expenseController.createExpenseCategory);
router.get('/categories', expenseController.getAllExpenseCategories);
router.get('/categories/:id', expenseController.getExpenseCategoryById);
router.put('/categories/:id', authorizeRoles("MANAGER"), expenseController.updateExpenseCategory);
router.delete('/categories/:id', authorizeRoles("MANAGER"), expenseController.deleteExpenseCategory);

// Routes cho loại chi (ExpenseType) - Chỉ MANAGER mới được tạo, sửa, xóa
router.post('/types', authorizeRoles("MANAGER"), expenseController.createExpenseType);
router.get('/types', expenseController.getAllExpenseTypes);
router.get('/types/:id', expenseController.getExpenseTypeById);
router.put('/types/:id', authorizeRoles("MANAGER"), expenseController.updateExpenseType);
router.delete('/types/:id', authorizeRoles("MANAGER"), expenseController.deleteExpenseType);

// Routes cho phiếu chi (ExpenseRecords) - Chỉ MANAGER mới được tạo, sửa, xóa
router.post('/vouchers', upload.single('attachment'), authorizeRoles("MANAGER"), expenseController.createExpenseRecords);
router.get('/vouchers', expenseController.getAllExpenseRecordss);
router.get('/vouchers/:id', expenseController.getExpenseRecordsById);
router.put('/vouchers/:id', upload.single('attachment'), authorizeRoles("MANAGER"), expenseController.updateExpenseRecords);
router.delete('/vouchers/:id', authorizeRoles("MANAGER"), expenseController.deleteExpenseRecords);

export default router;