import UserService from "./user.service.js";
import AuthService from "../auth/auth.service.js"; // authService login va token yangilash uchun

class UserController {
  #_userService;
  #_authService;

  constructor() {
    this.#_userService = UserService;
    this.#_authService = AuthService;
  }

  getAllUser = async (req, res, next) => {
    try {
      const data = await this.#_userService.getAllUsers();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  getElementById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.#_userService.getElementById(id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  registerUser = async (req, res, next) => {
    try {
      const data = await this.#_userService.register(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await this.#_authService.login({ email, password });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // 15 daqiqa
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 kun
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      res.status(200).json({
        message: "Kirish muvaffaqiyatli ✅",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token topilmadi" });
      }

      const { accessToken, refreshToken: newRefreshToken } = await this.#_authService.refreshToken(refreshToken);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      res.status(200).json({ message: "Tokenlar yangilandi" });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Chiqish muvaffaqiyatli" });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.#_userService.updateUser(id, req.body);
      res.status(200).json(data);
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
      res.status(200).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const response = await this.#_userService.resetPassword(req.body);
      res.status(200).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
