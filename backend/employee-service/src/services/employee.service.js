import validator from "validator";
import prisma from "../common/prisma/init.prisma.js";

const employeeService = {
  getEmployees: async () => {
    return await prisma.employee.findMany();
  },

  getEmployeeById: async (req) => {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!employee) {
      throw new Error("Không tìm thấy thông tin nhân viên");
    }
    return employee;
  },

  createEmployee: async (req) => {
    const { name, email, position, phone, gender, birth_date } = req.body;

    // Kiểm tra định dạng email
    if (!validator.isEmail(email)) {
      throw new Error("Email không hợp lệ");
    }

    // Kiểm tra định dạng số điện thoại
    if (phone && !validator.isMobilePhone(phone, "vi-VN")) {
      throw new Error("Số điện thoại không hợp lệ");
    }

    // Tạo nhân viên mới
    const newEmployee = await prisma.employee.create({
      data: {
        name: name,
        email: email,
        position: position,
        phone: phone,
        gender: gender,
        birth_date: new Date(birth_date),
      },
    });

    return newEmployee;
  },

  updateEmployee: async (req) => {
    const { id } = req.params;
    const updateData = req.body;

    // Kiểm tra xem nhân viên có tồn tại không
    const employee = await prisma.employee.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!employee) {
      throw new Error("Không tìm thấy thông tin nhân viên");
    }

    // Validate input data
    if (updateData.email && !validator.isEmail(updateData.email)) {
      throw new Error("Email không hợp lệ");
    }
    if (
      updateData.phone &&
      !validator.isMobilePhone(updateData.phone, "vi-VN")
    ) {
      throw new Error("Số điện thoại không hợp lệ");
    }

    // Cập nhật thông tin nhân viên
    const updateEmployee = await prisma.employee.update({
      where: {
        id: Number(id),
      },
      data: {
        ...updateData,
      },
    });
    return updateEmployee;
  },

  deleteEmployee: async (req) => {
    const { id } = req.params;
    // Kiểm tra xem nhân viên có tồn tại không
    const employee = await prisma.employee.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!employee) {
      throw new Error("Không tìm thấy thông tin nhân viên");
    }

    // Xóa nhân viên
    return await prisma.employee.delete({
      where: {
        id: Number(id),
      },
    });
  },
};

export default employeeService;
