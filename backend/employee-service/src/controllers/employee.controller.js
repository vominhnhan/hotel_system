import {
  responseError,
  responseSuccess,
} from "../common/helpers/response.helper.js";
import employeeService from "../services/employee.service.js";

const employeeController = {
  getEmployees: async (req, res) => {
    try {
      const data = await employeeService.getEmployees();
      const resData = responseSuccess(
        data,
        "Lấy danh sách nhân viên thành công",
        200
      );
      return res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 404);
      return res.status(resData.code).json(resData);
    }
  },

  getEmployeeById: async (req, res) => {
    try {
      const data = await employeeService.getEmployeeById(req);
      const resData = responseSuccess(
        data,
        "Lấy thông tin nhân viên thành công",
        200
      );
      return res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 404);
      return res.status(resData.code).json(resData);
    }
  },

  createEmployee: async (req, res) => {
    try {
      const data = await employeeService.createEmployee(req);
      const resData = responseSuccess(data, "Tạo nhân viên thành công", 201);
      return res.status(resData.code).json(resData);
    } catch (error) {
      console.log(error);
      const resData = responseError(error.message, 401);
      return res.status(resData.code).json(resData);
    }
  },

  updateEmployee: async (req, res) => {
    try {
      const data = await employeeService.updateEmployee(req);
      const resData = responseSuccess(
        data,
        "Cập nhật thông tin nhân viên thành công",
        201
      );
      return res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 401);
      return res.status(resData.code).json(resData);
    }
  },

  deleteEmployee: async (req, res) => {
    try {
      const data = await employeeService.deleteEmployee(req);
      const resData = responseSuccess(data, "Xóa nhân viên thành công", 201);
      return res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 401);
      return res.status(resData.code).json(resData);
    }
  },
};

export default employeeController;
