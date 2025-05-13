import validator from "validator";
import prisma from "../common/prisma/init.prisma.js";
import { ERROR_MESSAGES } from "../common/constants.js";
import { Prisma } from "@prisma/client";


const expenseService = {
  // Kiểm tra nhóm loại chi có tồn tại không
  checkExpenseCategoryExists: async (id) => {
    console.log("checkExpenseCategoryExists called with id:", id); // Debug
    const category = await prisma.expenseCategory.findUnique({ where: { id: parseInt(id) } });
    if (!category) {
      console.log("Expense category not found for id:", id); // Debug
      throw new Error(ERROR_MESSAGES.EXPENSE_CATEGORY_NOT_FOUND);
    }
    return category;
  },

  // Kiểm tra loại chi có tồn tại không
  checkExpenseTypeExists: async (id) => {
    console.log("checkExpenseTypeExists called with id:", id); // Debug
    const type = await prisma.expenseType.findUnique({ where: { id: parseInt(id) } });
    if (!type) {
      console.log("Expense type not found for id:", id); // Debug
      throw new Error(ERROR_MESSAGES.EXPENSE_TYPE_NOT_FOUND);
    }
    return type;
  },

  // Kiểm tra phiếu chi có tồn tại không
  checkExpenseRecordsExists: async (id) => {
    console.log("checkExpenseRecordsExists called with id:", id); // Debug
    const voucher = await prisma.ExpenseRecords.findUnique({ where: { id: parseInt(id) } });
    if (!voucher) {
      console.log("Expense voucher not found for id:", id); // Debug
      throw new Error(ERROR_MESSAGES.EXPENSE_VOUCHER_NOT_FOUND);
    }
    return voucher;
  },

  // Tạo nhóm loại chi mới
  createExpenseCategory: async (data) => {
    const { name } = data;
    if (!name) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }
    if (typeof name !== 'string' || name.length > 100) {
      throw new Error("Tên nhóm loại chi phải là chuỗi và không dài quá 100 ký tự");
    }
    return await prisma.expenseCategory.create({ data: { name } });
  },

  // Lấy nhóm loại chi theo ID
  getExpenseCategoryById: async (id) => {
    return await expenseService.checkExpenseCategoryExists(id);
  },

  // Lấy tất cả nhóm loại chi
  getAllExpenseCategories: async () => {
    console.log("getAllExpenseCategories called"); // Debug
    return await prisma.expenseCategory.findMany({ orderBy: { id: 'desc' } });
  },

  // Cập nhật nhóm loại chi
  updateExpenseCategory: async (id, data) => {
    const { name } = data;
    await expenseService.checkExpenseCategoryExists(id);
    if (name && (typeof name !== 'string' || name.length > 100)) {
      throw new Error("Tên nhóm loại chi phải là chuỗi và không dài quá 100 ký tự");
    }
    return await prisma.expenseCategory.update({ where: { id: parseInt(id) }, data: { name } });
  },

  // Xóa nhóm loại chi
  deleteExpenseCategory: async (id) => {
    await expenseService.checkExpenseCategoryExists(id);
    return await prisma.expenseCategory.delete({ where: { id: parseInt(id) } });
  },

  // Tạo loại chi mới
  createExpenseType: async (data) => {
    const { category_id, name, description } = data;
    if (!category_id || !name) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }
    if (!Number.isInteger(parseInt(category_id))) {
      throw new Error("ID nhóm loại chi phải là số nguyên");
    }
    if (typeof name !== 'string' || name.length > 100) {
      throw new Error("Tên loại chi phải là chuỗi và không dài quá 100 ký tự");
    }
    await expenseService.checkExpenseCategoryExists(category_id); // Kiểm tra category_id có tồn tại
    return await prisma.expenseType.create({
      data: { category_id: parseInt(category_id), name, description },
      include: { category: true },
    });
  },

  // Lấy loại chi theo ID
  getExpenseTypeById: async (id) => {
    const type = await expenseService.checkExpenseTypeExists(id);
    return await prisma.expenseType.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    });
  },

  // Lấy tất cả loại chi
  getAllExpenseTypes: async () => {
    console.log("getAllExpenseTypes called"); // Debug
    return await prisma.expenseType.findMany({
      include: { category: true },
      orderBy: { id: 'desc' },
    });
  },

  // Cập nhật loại chi
  updateExpenseType: async (id, data) => {
    const { category_id, name, description } = data;
    await expenseService.checkExpenseTypeExists(id);
    if (category_id && !Number.isInteger(parseInt(category_id))) {
      throw new Error("ID nhóm loại chi phải là số nguyên");
    }
    if (name && (typeof name !== 'string' || name.length > 100)) {
      throw new Error("Tên loại chi phải là chuỗi và không dài quá 100 ký tự");
    }
    if (category_id) {
      await expenseService.checkExpenseCategoryExists(category_id); // Kiểm tra category_id có tồn tại
    }
    return await prisma.expenseType.update({
      where: { id: parseInt(id) },
      data: { category_id: category_id ? parseInt(category_id) : undefined, name, description },
      include: { category: true },
    });
  },

  // Xóa loại chi
  deleteExpenseType: async (id) => {
    await expenseService.checkExpenseTypeExists(id);
    return await prisma.expenseType.delete({ where: { id: parseInt(id) } });
  },

  // Tạo phiếu chi mới
createExpenseRecords: async (data) => {
    console.log("createExpenseRecords called with data:", data); // Debug

    // Destructure input data
    const { code, expense_type_id, amount, note, receiver_name, is_accounted, attachment } = data;

    // Kiểm tra các trường bắt buộc
    if (!code || !expense_type_id || !amount) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    // Kiểm tra định dạng của mã phiếu chi
    if (typeof code !== 'string' || code.length > 50) {
      throw new Error("Mã phiếu chi phải là chuỗi và không dài quá 50 ký tự");
    }

    // Kiểm tra expense_type_id
    if (!Number.isInteger(expense_type_id)) {
      throw new Error("ID loại chi phải là số nguyên");
    }

    // Kiểm tra số tiền phải là số dương
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error("Số tiền phải là số dương");
    }

    // Kiểm tra expense_type_id có tồn tại
    await expenseService.checkExpenseTypeExists(expense_type_id);

    // Kiểm tra tên người nhận (nếu có)
    if (receiver_name && (typeof receiver_name !== 'string' || receiver_name.length > 100)) {
      throw new Error("Tên người nhận phải là chuỗi và không dài quá 100 ký tự");
    }

    // Kiểm tra đường dẫn tệp đính kèm (nếu có)
    if (attachment && (typeof attachment !== 'string' || attachment.length > 255)) {
      throw new Error("Đường dẫn tệp đính kèm không dài quá 255 ký tự");
    }

    // Tạo bản ghi phiếu chi trong cơ sở dữ liệu
    return await prisma.ExpenseRecords.create({
      data: {
        code, // Mã phiếu chi
        expense_type_id, // Loại chi phí (ID của ExpenseType)
        amount: new Prisma.Decimal(amount), // Sử dụng Decimal cho số tiền
        note: note || null, // Ghi chú, có thể null
        receiver_name: receiver_name || null, // Tên người nhận, có thể null
        is_accounted: is_accounted === undefined ? true : Boolean(is_accounted), // Trạng thái đã hạch toán
        attachment: attachment || null, // Đường dẫn tệp đính kèm, có thể null
      },
      include: {
        expense_type: true, // Bao gồm thông tin loại chi phí (ExpenseType)
      },
    });
  },


  // Lấy phiếu chi theo ID
  getExpenseRecordsById: async (id) => {
    const voucher = await expenseService.checkExpenseRecordsExists(id);
    return await prisma.ExpenseRecords.findUnique({
      where: { id: parseInt(id) },
      include: { expense_type: true },
    });
  },

  // Lấy tất cả phiếu chi
  getAllExpenseRecordss: async () => {
    console.log("getAllExpenseRecordss called"); // Debug
    return await prisma.ExpenseRecords.findMany({
      include: { expense_type: true },
      orderBy: { created_at: 'desc' },
    });
  },

  // Cập nhật phiếu chi
  updateExpenseRecords: async (id, data) => {
    const { code, expense_type_id, amount, note, receiver_name, is_accounted, attachment } = data;
    await expenseService.checkExpenseRecordsExists(id);
    if (code && (typeof code !== 'string' || code.length > 50)) {
      throw new Error("Mã phiếu chi phải là chuỗi và không dài quá 50 ký tự");
    }
    if (expense_type_id && !Number.isInteger(parseInt(expense_type_id))) {
      throw new Error("ID loại chi phải là số nguyên");
    }
    if (amount && (typeof amount !== 'number' || amount < 0)) {
      throw new Error("Số tiền phải là số dương");
    }
    if (expense_type_id) {
      await expenseService.checkExpenseTypeExists(expense_type_id); // Kiểm tra expense_type_id có tồn tại
    }
    if (receiver_name && (typeof receiver_name !== 'string' || receiver_name.length > 100)) {
      throw new Error("Tên người nhận phải là chuỗi và không dài quá 100 ký tự");
    }
    if (attachment && (typeof attachment !== 'string' || attachment.length > 255)) {
      throw new Error("Đường dẫn tệp đính kèm không dài quá 255 ký tự");
    }
    return await prisma.ExpenseRecords.update({
      where: { id: parseInt(id) },
      data: {
        code,
        expense_type_id: expense_type_id ? parseInt(expense_type_id) : undefined,
        amount,
        note: note !== undefined ? note : undefined,
        receiver_name: receiver_name !== undefined ? receiver_name : undefined,
        is_accounted: is_accounted !== undefined ? Boolean(is_accounted) : undefined,
        attachment: attachment !== undefined ? attachment : undefined,
      },
      include: { expense_type: true },
    });
  },

  // Xóa phiếu chi
  deleteExpenseRecords: async (id) => {
    console.log("deleteExpenseRecords called with id:", id); // Debug
    await expenseService.checkExpenseRecordsExists(id);
    return await prisma.ExpenseRecords.delete({ where: { id: parseInt(id) } });
  },
};

export default expenseService;