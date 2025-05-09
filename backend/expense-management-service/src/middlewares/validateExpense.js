import { body, validationResult } from 'express-validator';

const validateExpenseCategory = [
  body('name')
    .notEmpty()
    .withMessage('Tên nhóm loại chi không được để trống')
    .isLength({ max: 100 })
    .withMessage('Tên nhóm loại chi không được dài quá 100 ký tự'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateExpenseType = [
  body('category_id')
    .notEmpty()
    .withMessage('ID nhóm loại chi không được để trống')
    .isInt()
    .withMessage('ID nhóm loại chi phải là số nguyên'),
  body('name')
    .notEmpty()
    .withMessage('Tên loại chi không được để trống')
    .isLength({ max: 100 })
    .withMessage('Tên loại chi không được dài quá 100 ký tự'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateExpenseVoucher = [
  body('code')
    .notEmpty()
    .withMessage('Mã phiếu chi không được để trống')
    .isLength({ max: 50 })
    .withMessage('Mã phiếu chi không được dài quá 50 ký tự'),
  body('expense_type_id')
    .notEmpty()
    .withMessage('ID loại chi không được để trống')
    .isInt()
    .withMessage('ID loại chi phải là số nguyên'),
  body('amount')
    .notEmpty()
    .withMessage('Số tiền không được để trống')
    .isFloat({ min: 0 })
    .customSanitizer(value => parseFloat(value)) 
    .withMessage('Số tiền phải là số dương'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export { validateExpenseCategory, validateExpenseType, validateExpenseVoucher };
