import UserService from "./user.service.js";

class UserController {
  #_userService;
  constructor() {
    this.#_userService = UserService;
  }

  getAllUser = async (req, res, next) => {
    try {
      const data = await this.#_userService.getAllUsers();
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  getElementById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.#_userService.getElementById(id);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  registerUser = async (req, res, next) => {
    try {
      const data = await this.#_userService.register(req.body);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };
  loginUser = async (req, res, next) => {
    try {
      const result = await this.#_userService.login(req.body);

      res.cookie("accessToken", result.data.accessToken, {
        maxAge: 2 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
      });
      console.log("token",req.cookie)

      res.cookie("refreshToken", result.data.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
      });
     

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.#_userService.updateUser(id, req.body);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };
  deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.#_userService.deleteUser(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const response = await this.#_userService.forgotPassword(req.body);

      res.status(200).json({
        message: response.message,
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const response = await this.#_userService.resetPassword(req.body);

      res.status(200).json({
        message: response.message,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
