import {
  responseError,
  responseSuccess,
} from "../common/helpers/response.helper.js";
import authService from "../services/auth.service.js";

const authController = {
  login: async (req, res) => {
    try {
      const data = await authService.login(req);
      const resData = responseSuccess(data, "Đăng nhập thành công", 200);
      return res.status(resData.code).json(resData);
    } catch (error) {
      const resData = responseError(error.message, 401);
      return res.status(resData.code).json(resData);
    }
  },
};

export default authController;
