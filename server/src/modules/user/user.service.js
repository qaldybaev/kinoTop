import { isValidObjectId } from "mongoose";
import { BaseException } from "../../exception/base.exception.js";
import { sendMail } from "../../utils/mail.utils.js";
import crypto from "node:crypto";
import userModel from "./model/user.model.js";
import jwt from "jsonwebtoken";
import { compare, hash } from "bcrypt";
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_SECRET,
} from "../../config/jwt.config.js";
import { ROLES } from "../../constants/role.contant.js";

class UserService {
  #_userModel;
  constructor() {
    this.#_userModel = userModel;
    this.createSeedUser();
  }

  getAllUsers = async () => {
    const users = await this.#_userModel.find();
    return {
      message: "success✅",
      count: users.length,
      data: users,
    };
  };

  getElementById = async (id) => {
    if (!isValidObjectId(id)) {
      throw new BaseException(`ID: ${id} noto'g'ri kiritildi!`);
    }
    const user = await this.#_userModel.findById(id);
    if (!user) {
      throw new BaseException(`ID: ${id} bo‘yicha ma’lumot topilmadi`, 404);
    }
    return {
      message: "success✅",
      data: user,
    };
  };

  register = async ({ name, email, password, phoneNumber }) => {
    const foundUser = await this.#_userModel.findOne({ email });
    if (foundUser) {
      throw new BaseException("Bu email bilan allaqachon ro‘yxatdan o‘tildi!", 400);
    }

    const passwordHash = await hash(password, 10);
    const newUser = await this.#_userModel.create({
      name,
      email,
      password: passwordHash,
      phoneNumber,
      role: ROLES.USER,
    });

    return {
      message: "Ro‘yxatdan muvaffaqiyatli o‘tildi ✅",
      data: newUser,
    };
  };

  login = async ({ email, password }) => {
    const user = await this.#_userModel.findOne({ email });
    if (!user) {
      throw new BaseException("Foydalanuvchi topilmadi", 404);
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new BaseException("Parol noto‘g‘ri kiritildi!", 400);
    }

    const accessToken = jwt.sign(
      { user: user.id, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRE_TIME }
    );

    const refreshToken = jwt.sign(
      { user: user.id, role: user.role },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRE_TIME }
    );

    // Refresh tokenni DBda saqlash (optional, xavfsizlik uchun)
    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  };

  refreshToken = async (token) => {
    try {
      if (!token) throw new BaseException("Token topilmadi", 401);

      // Tokenni tekshirish
      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);

      // Foydalanuvchini topish va token tekshirish
      const user = await this.#_userModel.findById(decoded.user);
      if (!user) {
        throw new BaseException("Foydalanuvchi topilmadi", 404);
      }

      if (user.refreshToken !== token) {
        throw new BaseException("Refresh token noto‘g‘ri", 403);
      }

      // Yangi access va refresh token yaratish
      const newAccessToken = jwt.sign(
        { user: user.id, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRE_TIME }
      );
      const newRefreshToken = jwt.sign(
        { user: user.id, role: user.role },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRE_TIME }
      );

      // DBdagi tokenni yangilash
      user.refreshToken = newRefreshToken;
      await user.save();

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new BaseException("Token muddati tugagan", 401);
      }
      throw new BaseException(error.message, 401);
    }
  };

  updateUser = async (id, data) => {
    if (!isValidObjectId(id)) {
      throw new BaseException(`ID: ${id} noto‘g‘ri kiritildi!`);
    }

    if (data.password) {
      data.password = await hash(data.password, 10);
    }

    const updatedUser = await this.#_userModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new BaseException(`ID: ${id} bo‘yicha foydalanuvchi topilmadi`, 404);
    }

    return {
      message: "Foydalanuvchi yangilandi",
      data: updatedUser,
    };
  };

  deleteUser = async (id) => {
    if (!isValidObjectId(id)) {
      throw new BaseException(`ID: ${id} noto‘g‘ri kiritildi!`);
    }

    const deletedUser = await this.#_userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new BaseException(`ID: ${id} bo‘yicha foydalanuvchi topilmadi`, 404);
    }

    return {
      message: "Foydalanuvchi o‘chirildi",
    };
  };

  forgotPassword = async ({ email }) => {
    const user = await this.#_userModel.findOne({ email });
    if (!user) {
      throw new BaseException("Foydalanuvchi topilmadi", 404);
    }

    // Parol tiklash tokeni yaratish va bazaga saqlash (1 soat amal qiluvchi)
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpire = Date.now() + 3600000; // 1 soat

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    // Emailga link yuborish
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    const html = `<p>Parolingizni tiklash uchun quyidagi havolani bosing:</p><a href="${resetLink}">${resetLink}</a>`;

    await sendMail(email, "Parolni tiklash", html);

    return {
      message: "Parolni tiklash uchun havola emailingizga yuborildi",
    };
  };

  resetPassword = async ({ email, token, newPassword }) => {
    const user = await this.#_userModel.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new BaseException("Token noto‘g‘ri yoki muddati tugagan", 400);
    }

    user.password = await hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return {
      message: "Parol muvaffaqiyatli yangilandi",
    };
  };

  async createSeedUser() {
    const adminExists = await this.#_userModel.findOne({ email: "nurkenqaldybaev2001@gmail.com" });
    if (!adminExists) {
      const hashedPassword = await hash("123456", 10);
      await this.#_userModel.create({
        name: "Nurken",
        email: "nurkenqaldybaev2001@gmail.com",
        password: hashedPassword,
        role: ROLES.ADMIN,
      });
    }
  }
}

export default new UserService();
