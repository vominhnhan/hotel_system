// payment-service/services/paymentService.js
import prisma from '../common/prisma/init.prisma.js';
import { ERROR_MESSAGES } from '../common/constants.js';

const paymentService = {
  // Kiểm tra thanh toán có tồn tại không
  checkPaymentExists: async (id) => {
    console.log('checkPaymentExists called with id:', id); // Debug
    const payment = await prisma.payment.findUnique({ where: { id: parseInt(id) } });
    if (!payment) {
      console.log('Payment not found for id:', id); // Debug
      throw new Error(ERROR_MESSAGES.PAYMENT_NOT_FOUND);
    }
    return payment;
  },

  // Kiểm tra hóa đơn có tồn tại không
  checkInvoiceExists: async (id) => {
    console.log('checkInvoiceExists called with id:', id); // Debug
    const invoice = await prisma.invoice.findUnique({ where: { id: parseInt(id) } });
    if (!invoice) {
      console.log('Invoice not found for id:', id); // Debug
      throw new Error(ERROR_MESSAGES.INVOICE_NOT_FOUND);
    }
    return invoice;
  },

  // Tạo thanh toán mới
  createPayment: async (data) => {
    const { booking_id, order_id, customer_id, payment_method, amount, status } = data;
    if (!booking_id || !customer_id || !payment_method || amount == null) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }
    if (!Number.isInteger(parseInt(booking_id)) || !Number.isInteger(parseInt(customer_id))) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }
    if (order_id && !Number.isInteger(parseInt(order_id))) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }
    if (typeof payment_method !== 'string' || payment_method.length > 50) {
      throw new Error('Phương thức thanh toán phải là chuỗi và không dài quá 50 ký tự');
    }
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }
    if (status && !['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].includes(status)) {
      throw new Error(ERROR_MESSAGES.INVALID_STATUS);
    }
    return await prisma.payment.create({
      data: {
        booking_id: parseInt(booking_id),
        order_id: order_id ? parseInt(order_id) : null,
        customer_id: parseInt(customer_id),
        payment_method,
        amount: parseFloat(amount),
        status: status || 'PENDING',
      },
      include: { invoices: { include: { items: true } } },
    });
  },

  // Lấy thanh toán theo ID
  getPaymentById: async (id) => {
    return await paymentService.checkPaymentExists(id);
  },

  // Lấy tất cả thanh toán
  getAllPayments: async () => {
    console.log('getAllPayments called'); // Debug
    return await prisma.payment.findMany({
      include: { invoices: { include: { items: true } } },
      orderBy: { id: 'desc' },
    });
  },

  // Cập nhật thanh toán
  updatePayment: async (id, data) => {
    const { booking_id, order_id, customer_id, payment_method, amount, status } = data;
    await paymentService.checkPaymentExists(id);
    if (booking_id && !Number.isInteger(parseInt(booking_id))) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }
    if (order_id && !Number.isInteger(parseInt(order_id))) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }
    if (customer_id && !Number.isInteger(parseInt(customer_id))) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }
    if (payment_method && (typeof payment_method !== 'string' || payment_method.length > 50)) {
      throw new Error('Phương thức thanh toán phải là chuỗi và không dài quá 50 ký tự');
    }
    if (amount && (typeof amount !== 'number' || amount < 0)) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }
    if (status && !['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].includes(status)) {
      throw new Error(ERROR_MESSAGES.INVALID_STATUS);
    }
    return await prisma.payment.update({
      where: { id: parseInt(id) },
      data: {
        booking_id: booking_id ? parseInt(booking_id) : undefined,
        order_id: order_id ? parseInt(order_id) : undefined,
        customer_id: customer_id ? parseInt(customer_id) : undefined,
        payment_method: payment_method || undefined,
        amount: amount ? parseFloat(amount) : undefined,
        status: status || undefined,
      },
      include: { invoices: { include: { items: true } } },
    });
  },

  // Xóa thanh toán
  deletePayment: async (id) => {
    await paymentService.checkPaymentExists(id);
    return await prisma.payment.delete({ where: { id: parseInt(id) } });
  },

  // Tạo hóa đơn mới
  createInvoice: async (data) => {
    console.log('createInvoice called with data:', data); // Debug
    const { payment_id, customer_id, total_amount, attachment } = data;
    if (!payment_id || !customer_id || total_amount == null) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }
    if (!Number.isInteger(parseInt(payment_id)) || !Number.isInteger(parseInt(customer_id))) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }
    if (typeof total_amount !== 'number' || total_amount < 0) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }
    if (attachment && (typeof attachment !== 'string' || attachment.length > 255)) {
      throw new Error('Đường dẫn tệp đính kèm không dài quá 255 ký tự');
    }
    await paymentService.checkPaymentExists(payment_id); // Kiểm tra payment_id có tồn tại
    return await prisma.invoice.create({
      data: {
        payment_id: parseInt(payment_id),
        customer_id: parseInt(customer_id),
        total_amount: parseFloat(total_amount),
        attachment: attachment || null,
      },
      include: { payment: true, items: true },
    });
  },

  // Lấy hóa đơn theo ID
  getInvoiceById: async (id) => {
    const invoice = await paymentService.checkInvoiceExists(id);
    return await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
      include: { payment: true, items: true },
    });
  },

  // Lấy tất cả hóa đơn
  getAllInvoices: async () => {
    console.log('getAllInvoices called'); // Debug
    return await prisma.invoice.findMany({
      include: { payment: true, items: true },
      orderBy: { created_at: 'desc' },
    });
  },

  // Cập nhật hóa đơn
  updateInvoice: async (id, data) => {
    const { payment_id, customer_id, total_amount, attachment } = data;
    await paymentService.checkInvoiceExists(id);
    if (payment_id && !Number.isInteger(parseInt(payment_id))) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }
    if (customer_id && !Number.isInteger(parseInt(customer_id))) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }
    if (total_amount && (typeof total_amount !== 'number' || total_amount < 0)) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }
    if (attachment && (typeof attachment !== 'string' || attachment.length > 255)) {
      throw new Error('Đường dẫn tệp đính kèm không dài quá 255 ký tự');
    }
    if (payment_id) {
      await paymentService.checkPaymentExists(payment_id); // Kiểm tra payment_id có tồn tại
    }
    return await prisma.invoice.update({
      where: { id: parseInt(id) },
      data: {
        payment_id: payment_id ? parseInt(payment_id) : undefined,
        customer_id: customer_id ? parseInt(customer_id) : undefined,
        total_amount: total_amount ? parseFloat(total_amount) : undefined,
        attachment: attachment !== undefined ? attachment : undefined,
      },
      include: { payment: true, items: true },
    });
  },

  // Xóa hóa đơn
  deleteInvoice: async (id) => {
    console.log('deleteInvoice called with id:', id); // Debug
    await paymentService.checkInvoiceExists(id);
    return await prisma.invoice.delete({ where: { id: parseInt(id) } });
  },

  // Tạo chi tiết hóa đơn mới
  createInvoiceItem: async (data) => {
    const { invoice_id, description, quantity, unit_price } = data;
    if (!invoice_id || !description || quantity == null || unit_price == null) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }
    if (!Number.isInteger(parseInt(invoice_id))) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }
    if (typeof description !== 'string' || description.length > 255) {
      throw new Error('Mô tả phải là chuỗi và không dài quá 255 ký tự');
    }
    if (!Number.isInteger(parseInt(quantity)) || parseInt(quantity) < 0) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }
    if (typeof unit_price !== 'number' || unit_price < 0) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }
    await paymentService.checkInvoiceExists(invoice_id); // Kiểm tra invoice_id có tồn tại
    const total = parseFloat(unit_price) * parseInt(quantity);
    return await prisma.invoiceItem.create({
      data: {
        invoice_id: parseInt(invoice_id),
        description,
        quantity: parseInt(quantity),
        unit_price: parseFloat(unit_price),
        total,
      },
    });
  },

  // Lấy danh sách chi tiết hóa đơn theo invoice_id
  getInvoiceItemsByInvoiceId: async (id) => {
    console.log('getInvoiceItemsByInvoiceId called with id:', id); // Debug
    return await prisma.invoiceItem.findMany({
      where: { invoice_id: parseInt(id) },
      orderBy: { id: 'desc' },
    });
  },
};

export default paymentService;