import expenseService from "../services/expenseService.js";
import { ERROR_MESSAGES } from "../common/constants.js";

const expenseController = {
  // Tạo nhóm loại chi mới
  createExpenseCategory: async (req, res) => {
    try {
      const category = await expenseService.createExpenseCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getExpenseCategoryById: async (req, res) => {
    console.log("Calling getExpenseCategoryById with params:", req.params);
    try {
      const category = await expenseService.getExpenseCategoryById(req.params.id);
      res.status(200).json(category);
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_CATEGORY_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  getAllExpenseCategories: async (req, res) => {
    try {
      const categories = await expenseService.getAllExpenseCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateExpenseCategory: async (req, res) => {
    try {
      const category = await expenseService.updateExpenseCategory(req.params.id, req.body);
      res.status(200).json(category);
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_CATEGORY_NOT_FOUND) ? 404 : 400).json({ error: error.message });
    }
  },

  deleteExpenseCategory: async (req, res) => {
    try {
      await expenseService.deleteExpenseCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_CATEGORY_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  createExpenseType: async (req, res) => {
    try {
      const type = await expenseService.createExpenseType(req.body);
      res.status(201).json(type);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getExpenseTypeById: async (req, res) => {
    try {
      const type = await expenseService.getExpenseTypeById(req.params.id);
      res.status(200).json(type);
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_TYPE_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  getAllExpenseTypes: async (req, res) => {
    try {
      const types = await expenseService.getAllExpenseTypes();
      res.status(200).json(types);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateExpenseType: async (req, res) => {
    try {
      const type = await expenseService.updateExpenseType(req.params.id, req.body);
      res.status(200).json(type);
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_TYPE_NOT_FOUND) ? 404 : 400).json({ error: error.message });
    }
  },

  deleteExpenseType: async (req, res) => {
    try {
      await expenseService.deleteExpenseType(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_TYPE_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  // Tạo phiếu chi mới (có xử lý tệp đính kèm)
  createExpenseVoucher: async (req, res) => {
    try {
      const data = {
        ...req.body,
        attachment: req.file ? `/uploads/${req.file.filename}` : null, // Lưu đường dẫn tệp
      };
      const voucher = await expenseService.createExpenseVoucher(data);
      res.status(201).json(voucher);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getExpenseVoucherById: async (req, res) => {
    try {
      const voucher = await expenseService.getExpenseVoucherById(req.params.id);
      res.status(200).json(voucher);
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_VOUCHER_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  getAllExpenseVouchers: async (req, res) => {
    console.log("Controller: getAllExpenseVouchers called");
    try {
      const vouchers = await expenseService.getAllExpenseVouchers();
      res.status(200).json(vouchers);
    } catch (error) {
      console.log("Error in getAllExpenseVouchers:", error.message);
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật phiếu chi (có xử lý tệp đính kèm)
  updateExpenseVoucher: async (req, res) => {
    try {
      const data = {
        ...req.body,
        attachment: req.file ? `/uploads/${req.file.filename}` : req.body.attachment, // Cập nhật đường dẫn nếu có tệp mới
      };
      const voucher = await expenseService.updateExpenseVoucher(req.params.id, data);
      res.status(200).json(voucher);
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_VOUCHER_NOT_FOUND) ? 404 : 400).json({ error: error.message });
    }
  },

  deleteExpenseVoucher: async (req, res) => {
    try {
      await expenseService.deleteExpenseVoucher(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_VOUCHER_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },
};

export default expenseController;