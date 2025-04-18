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
      });
      res.cookie("refreshToken", result.data.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
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
}

export default new UserController();
