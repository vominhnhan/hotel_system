import expenseService from "../services/expenseService.js";
import { ERROR_MESSAGES } from "../common/constants.js";

const expenseController = {
  // Tạo nhóm loại chi mới
  createExpenseCategory: async (req, res) => {
    try {
      const category = await expenseService.createExpenseCategory(req.body);
      res.status(201).json(category);  // Trả về mã 201 khi tạo thành công
    } catch (error) {
      res.status(400).json({ error: error.message });  // Trả về mã 400 khi có lỗi
    }
  },

  getExpenseCategoryById: async (req, res) => {
    try {
      const category = await expenseService.getExpenseCategoryById(req.params.id);
      if (!category) {
        throw new Error(ERROR_MESSAGES.EXPENSE_CATEGORY_NOT_FOUND);  // Kiểm tra xem có tồn tại nhóm loại chi không
      }
      res.status(200).json(category);  // Trả về nhóm loại chi
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_CATEGORY_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  getAllExpenseCategories: async (req, res) => {
    try {
      const categories = await expenseService.getAllExpenseCategories();
      res.status(200).json(categories);  // Trả về danh sách nhóm loại chi
    } catch (error) {
      res.status(500).json({ error: error.message });  // Trả về mã 500 khi có lỗi
    }
  },

  updateExpenseCategory: async (req, res) => {
    try {
      const category = await expenseService.updateExpenseCategory(req.params.id, req.body);
      if (!category) {
        throw new Error(ERROR_MESSAGES.EXPENSE_CATEGORY_NOT_FOUND);  // Kiểm tra có tồn tại nhóm loại chi không
      }
      res.status(200).json(category);  // Trả về nhóm loại chi sau khi cập nhật
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_CATEGORY_NOT_FOUND) ? 404 : 400).json({ error: error.message });
    }
  },

  deleteExpenseCategory: async (req, res) => {
    try {
      const result = await expenseService.deleteExpenseCategory(req.params.id);
      if (!result) {
        throw new Error(ERROR_MESSAGES.EXPENSE_CATEGORY_NOT_FOUND);  // Kiểm tra có tồn tại nhóm loại chi không
      }
      res.status(204).send();  // Trả về mã 204 khi xóa thành công
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_CATEGORY_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  createExpenseType: async (req, res) => {
    try {
      const type = await expenseService.createExpenseType(req.body);
      res.status(201).json(type);  // Trả về mã 201 khi tạo mới thành công
    } catch (error) {
      res.status(400).json({ error: error.message });  // Trả về mã 400 khi có lỗi
    }
  },

  getExpenseTypeById: async (req, res) => {
    try {
      const type = await expenseService.getExpenseTypeById(req.params.id);
      if (!type) {
        throw new Error(ERROR_MESSAGES.EXPENSE_TYPE_NOT_FOUND);  // Kiểm tra nếu không tìm thấy loại chi
      }
      res.status(200).json(type);  // Trả về loại chi
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_TYPE_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  getAllExpenseTypes: async (req, res) => {
    try {
      const types = await expenseService.getAllExpenseTypes();
      res.status(200).json(types);  // Trả về danh sách loại chi
    } catch (error) {
      res.status(500).json({ error: error.message });  // Trả về mã 500 khi có lỗi
    }
  },

  updateExpenseType: async (req, res) => {
    try {
      const type = await expenseService.updateExpenseType(req.params.id, req.body);
      if (!type) {
        throw new Error(ERROR_MESSAGES.EXPENSE_TYPE_NOT_FOUND);  // Kiểm tra loại chi có tồn tại không
      }
      res.status(200).json(type);  // Trả về loại chi sau khi cập nhật
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_TYPE_NOT_FOUND) ? 404 : 400).json({ error: error.message });
    }
  },

  deleteExpenseType: async (req, res) => {
    try {
      const result = await expenseService.deleteExpenseType(req.params.id);
      if (!result) {
        throw new Error(ERROR_MESSAGES.EXPENSE_TYPE_NOT_FOUND);  // Kiểm tra có tồn tại loại chi không
      }
      res.status(204).send();  // Trả về mã 204 khi xóa thành công
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_TYPE_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  createExpenseRecords: async (req, res) => {
    try {
      const data = {
        ...req.body,
        attachment: req.file ? `/uploads/${req.file.filename}` : null,  // Lưu đường dẫn tệp đính kèm
      };
      const voucher = await expenseService.createExpenseRecords(data);
      res.status(201).json(voucher);  // Trả về phiếu chi mới
    } catch (error) {
      res.status(400).json({ error: error.message });  // Trả về mã 400 khi có lỗi
    }
  },

  getExpenseRecordsById: async (req, res) => {
    try {
      const voucher = await expenseService.getExpenseRecordsById(req.params.id);
      if (!voucher) {
        throw new Error(ERROR_MESSAGES.EXPENSE_VOUCHER_NOT_FOUND);  // Kiểm tra nếu không tìm thấy phiếu chi
      }
      res.status(200).json(voucher);  // Trả về phiếu chi
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_VOUCHER_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  getAllExpenseRecordss: async (req, res) => {
    try {
      const vouchers = await expenseService.getAllExpenseRecordss();
      res.status(200).json(vouchers);  // Trả về danh sách phiếu chi
    } catch (error) {
      res.status(500).json({ error: error.message });  // Trả về mã 500 khi có lỗi
    }
  },

  updateExpenseRecords: async (req, res) => {
    try {
      const data = {
        ...req.body,
        attachment: req.file ? `/uploads/${req.file.filename}` : req.body.attachment,  // Cập nhật tệp nếu có
      };
      const voucher = await expenseService.updateExpenseRecords(req.params.id, data);
      if (!voucher) {
        throw new Error(ERROR_MESSAGES.EXPENSE_VOUCHER_NOT_FOUND);  // Kiểm tra phiếu chi có tồn tại không
      }
      res.status(200).json(voucher);  // Trả về phiếu chi sau khi cập nhật
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_VOUCHER_NOT_FOUND) ? 404 : 400).json({ error: error.message });
    }
  },

  deleteExpenseRecords: async (req, res) => {
    try {
      const result = await expenseService.deleteExpenseRecords(req.params.id);
      if (!result) {
        throw new Error(ERROR_MESSAGES.EXPENSE_VOUCHER_NOT_FOUND);  // Kiểm tra có tồn tại phiếu chi không
      }
      res.status(204).send();  // Trả về mã 204 khi xóa thành công
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.EXPENSE_VOUCHER_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },
};

export default expenseController;
