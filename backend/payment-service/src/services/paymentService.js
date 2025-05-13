import prisma from '../common/prisma/init.prisma.js';
import { ERROR_MESSAGES } from '../common/constants.js';
import { validate as uuidValidate } from 'uuid'; // Thêm thư viện uuid để kiểm tra UUID

const paymentService = {
  // Kiểm tra thanh toán có tồn tại không
  checkPaymentExists: async (id) => {
    console.log('checkPaymentExists called with id:', id); // Debug
    const paymentId = parseInt(id);
    if (isNaN(paymentId)) {
      throw new Error('ID thanh toán phải là số nguyên hợp lệ');
    }
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      console.log('Payment not found for id:', id); // Debug
      throw new Error(ERROR_MESSAGES.PAYMENT_NOT_FOUND);
    }
    return payment;
  },

  // Kiểm tra hóa đơn có tồn tại không
  checkInvoiceExists: async (id) => {
    console.log('checkInvoiceExists called with id:', id); // Debug
    const invoiceId = parseInt(id);
    if (isNaN(invoiceId)) {
      throw new Error('ID hóa đơn phải là số nguyên hợp lệ');
    }
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) {
      console.log('Invoice not found for id:', id); // Debug
      throw new Error(ERROR_MESSAGES.INVOICE_NOT_FOUND);
    }
    return invoice;
  },

  // Tạo thanh toán mới
  createPayment: async (data) => {
    const { booking_id, order_id, customer_id, payment_method, deposit, status } = data;

    // Kiểm tra các trường bắt buộc
    if (!booking_id || !customer_id || !payment_method || deposit == null) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    // Kiểm tra UUID hợp lệ
    if (!uuidValidate(booking_id)) {
      throw new Error('booking_id phải là UUID hợp lệ');
    }
    if (!uuidValidate(customer_id)) {
      throw new Error('customer_id phải là UUID hợp lệ');
    }
    if (order_id && !uuidValidate(order_id)) {
      throw new Error('order_id phải là UUID hợp lệ');
    }

    // Kiểm tra payment_method
    if (typeof payment_method !== 'string' || payment_method.length > 50) {
      throw new Error('Phương thức thanh toán phải là chuỗi và không dài quá 50 ký tự');
    }

    // Kiểm tra deposit
    if (typeof deposit !== 'number' || deposit < 0) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }

    // Kiểm tra status
    if (status && !['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].includes(status)) {
      throw new Error(ERROR_MESSAGES.INVALID_STATUS);
    }

    return await prisma.payment.create({
      data: {
        booking_id, // Giữ nguyên chuỗi UUID
        order_id: order_id || null,
        customer_id, // Giữ nguyên chuỗi UUID
        payment_method,
        deposit: parseFloat(deposit.toFixed(2)), // Đảm bảo deposit có 2 chữ số thập phân
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
    const { booking_id, order_id, customer_id, payment_method, deposit, status } = data;
    await paymentService.checkPaymentExists(id);

    // Kiểm tra UUID hợp lệ nếu có
    if (booking_id && !uuidValidate(booking_id)) {
      throw new Error('booking_id phải là UUID hợp lệ');
    }
    if (order_id && !uuidValidate(order_id)) {
      throw new Error('order_id phải là UUID hợp lệ');
    }
    if (customer_id && !uuidValidate(customer_id)) {
      throw new Error('customer_id phải là UUID hợp lệ');
    }

    // Kiểm tra payment_method
    if (payment_method && (typeof payment_method !== 'string' || payment_method.length > 50)) {
      throw new Error('Phương thức thanh toán phải là chuỗi và không dài quá 50 ký tự');
    }

    // Kiểm tra deposit
    if (deposit !== undefined && (typeof deposit !== 'number' || deposit < 0)) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }

    // Kiểm tra status
    if (status && !['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].includes(status)) {
      throw new Error(ERROR_MESSAGES.INVALID_STATUS);
    }

    return await prisma.payment.update({
      where: { id: parseInt(id) },
      data: {
        booking_id: booking_id || undefined,
        order_id: order_id || undefined,
        customer_id: customer_id || undefined,
        payment_method: payment_method || undefined,
        deposit: deposit !== undefined ? parseFloat(deposit.toFixed(2)) : undefined,
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
    const { payment_id, customer_id, attachment } = data;

    // Kiểm tra các trường bắt buộc
    if (!payment_id || !customer_id) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    // Kiểm tra payment_id là số nguyên
    const parsedPaymentId = parseInt(payment_id);
    if (isNaN(parsedPaymentId)) {
      throw new Error('payment_id phải là số nguyên hợp lệ');
    }

    // Kiểm tra customer_id là UUID
    if (!uuidValidate(customer_id)) {
      throw new Error('customer_id phải là UUID hợp lệ');
    }

  

    // Kiểm tra attachment
    if (attachment && (typeof attachment !== 'string' || attachment.length > 255)) {
      throw new Error('Đường dẫn tệp đính kèm không dài quá 255 ký tự');
    }

    // Kiểm tra payment_id có tồn tại
    await paymentService.checkPaymentExists(parsedPaymentId);

    return await prisma.invoice.create({
      data: {
        payment_id: parsedPaymentId,
        customer_id, // Giữ nguyên chuỗi UUID
        attachment: attachment || null,
      },
      include: { payment: true, items: true },
    });
  },

  // Lấy hóa đơn theo ID
  getInvoiceById: async (id) => {
    await paymentService.checkInvoiceExists(id);
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
    const { payment_id, customer_id,  attachment } = data;
    await paymentService.checkInvoiceExists(id);

    // Kiểm tra payment_id nếu có
    if (payment_id) {
      const parsedPaymentId = parseInt(payment_id);
      if (isNaN(parsedPaymentId)) {
        throw new Error('payment_id phải là số nguyên hợp lệ');
      }
      await paymentService.checkPaymentExists(parsedPaymentId);
    }

    // Kiểm tra customer_id nếu có
    if (customer_id && !uuidValidate(customer_id)) {
      throw new Error('customer_id phải là UUID hợp lệ');
    }



    // Kiểm tra attachment
    if (attachment && (typeof attachment !== 'string' || attachment.length > 255)) {
      throw new Error('Đường dẫn tệp đính kèm không dài quá 255 ký tự');
    }

    return await prisma.invoice.update({
      where: { id: parseInt(id) },
      data: {
        payment_id: payment_id ? parseInt(payment_id) : undefined,
        customer_id: customer_id || undefined,
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

    // Kiểm tra các trường bắt buộc
    if (!invoice_id || !description || quantity == null || unit_price == null) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    // Kiểm tra invoice_id là số nguyên
    const parsedInvoiceId = parseInt(invoice_id);
    if (isNaN(parsedInvoiceId)) {
      throw new Error('invoice_id phải là số nguyên hợp lệ');
    }

    // Kiểm tra description
    if (typeof description !== 'string' || description.length > 255) {
      throw new Error('Mô tả phải là chuỗi và không dài quá 255 ký tự');
    }

    // Kiểm tra quantity
    if (!Number.isInteger(parseInt(quantity)) || parseInt(quantity) < 0) {
      throw new Error(ERROR_MESSAGES.INVALID_QUANTITY);
    }

    // Kiểm tra unit_price
    if (typeof unit_price !== 'number' || unit_price < 0) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }

    // Kiểm tra invoice_id có tồn tại
    await paymentService.checkInvoiceExists(parsedInvoiceId);

    const total = parseFloat(unit_price) * parseInt(quantity);
    return await prisma.invoiceItem.create({
      data: {
        invoice_id: parsedInvoiceId,
        description,
        quantity: parseInt(quantity),
        unit_price: parseFloat(unit_price.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      },
    });
  },

  // Lấy danh sách chi tiết hóa đơn theo invoice_id
  getInvoiceItemsByInvoiceId: async (id) => {
    console.log('getInvoiceItemsByInvoiceId called with id:', id); // Debug
    const invoiceId = parseInt(id);
    if (isNaN(invoiceId)) {
      throw new Error('invoice_id phải là số nguyên hợp lệ');
    }
    return await prisma.invoiceItem.findMany({
      where: { invoice_id: invoiceId },
      orderBy: { id: 'desc' },
    });
  },
};

export default paymentService;