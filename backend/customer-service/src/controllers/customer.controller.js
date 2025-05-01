import {
  responseError,
  responseSuccess,
} from "../common/helpers/response.helper.js";
import customerService from "../services/customer.service.js";

const customerController = {
  getCustomers: async (req, res) => {
    try {
      const data = await customerService.getCustomers();
      const resData = responseSuccess(
        data,
        "Lấy danh sách khách hàng thành công",
        200
      );
      return res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 404);
      return res.status(resData.code).json(resData);
    }
  },

  getCustomerById: async (req, res) => {
    try {
      const data = await customerService.getCustomerById(req);
      const resData = responseSuccess(
        data,
        "Lấy thông tin khách hàng thành công",
        200
      );
      return res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 404);
      return res.status(resData.code).json(resData);
    }
  },

  createCustomer: async (req, res) => {
    try {
      const data = await customerService.createCustomer(req);
      const resData = responseSuccess(data, "Tạo khách hàng thành công", 201);
      return res.status(resData.code).json(resData);
    } catch (error) {
      console.log(error);
      const resData = responseError(error.message, 401);
      return res.status(resData.code).json(resData);
    }
  },

  updateCustomer: async (req, res) => {
    try {
      const data = await customerService.updateCustomer(req);
      const resData = responseSuccess(
        data,
        "Cập nhật thông tin khách hàng thành công",
        201
      );
      return res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 401);
      return res.status(resData.code).json(resData);
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      const data = await customerService.deleteCustomer(req);
      const resData = responseSuccess(data, "Xóa khách hàng thành công", 201);
      return res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 401);
      return res.status(resData.code).json(resData);
    }
  },
};

export default customerController;
