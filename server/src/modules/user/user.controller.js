import UserService from "./user.servise.js";

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
      const data = await this.#_userService.login(req.body);
      res.ststus(200).send(data);
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
