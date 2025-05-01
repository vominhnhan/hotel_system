import prisma from "../common/prisma/init.prisma.js";
import validator from "validator";

const customerService = {
  getCustomers: async () => {
    return await prisma.customer.findMany();
  },

  getCustomerById: async (req) => {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!customer) {
      throw new Error("Không tìm thấy thông tin khách hàng");
    }
    return customer;
  },

  createCustomer: async (req) => {
    const { name, email, phone, identity_card } = req.body;

    // Kiểm tra định dạng email
    if (!validator.isEmail(email)) {
      throw new Error("Email không hợp lệ");
    }

    // Kiểm tra định dạng số điện thoại
    if (phone && !validator.isMobilePhone(phone, "vi-VN")) {
      throw new Error("Số điện thoại không hợp lệ");
    }

    // Tạo khách hàng mới
    const newCustomer = await prisma.customer.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        identity_card: identity_card,
      },
    });

    return newCustomer;
  },

  updateCustomer: async (req) => {
    const { id } = req.params;
    const updateData = req.body;

    const employee = await prisma.customer.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!employee) {
      throw new Error("Không tìm thấy thông tin khách hàng");
    }

    if (updateData.email && !validator.isEmail(updateData.email)) {
      throw new Error("Email không hợp lệ");
    }
    if (
      updateData.phone &&
      !validator.isMobilePhone(updateData.phone, "vi-VN")
    ) {
      throw new Error("Số điện thoại không hợp lệ");
    }

    // Cập nhật thông tin
    const updateCustomer = await prisma.customer.update({
      where: {
        id: Number(id),
      },
      data: {
        ...updateData,
      },
    });

    return updateCustomer;
  },

  deleteCustomer: async (req) => {
    const { id } = req.params;
    const employee = await prisma.customer.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!employee) {
      throw new Error("Không tìm thấy thông tin khách hàng");
    }

    return await prisma.customer.delete({
      where: {
        id: Number(id),
      },
    });
  },
};

export default customerService;
