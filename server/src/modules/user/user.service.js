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
      throw new BaseException(`ID: ${id} boyicha malumot topilmadi`, 404);
    }
    return {
      message: "success✅",
      data: user,
    };
  };
  register = async ({ name, email, password, phoneNumber }) => {
    const foundedUser = await this.#_userModel.findOne({ email });

    if (foundedUser) {
      throw new BaseException(
        "Bu email bilan allaqachon royxattan o'tilgan!",
        400
      );
    }

    const passwordHash = await hash(password, 10);

    const newUser = await this.#_userModel.create({
      name,
      email,
      password: passwordHash,
      phoneNumber,
    });

    return {
      message: "Ro'yxatdan muvaffaqiyatli o'tildi ✅",
      data: newUser,
    };
  };
  login = async ({ email, password }) => {
    console.log("login", email, password);
    const user = await this.#_userModel.findOne({ email });

    if (!user) {
      throw new BaseException("Foydalanuvchi topilmadi", 404);
    }
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new BaseException("Parol xato kiritildi!", 400);
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

    return {
      message: "Kirish muvaffaqiyatli ✅",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    };
  };

  updateUser = async (id, { name, email, password, phoneNumber }) => {
    if (!isValidObjectId(id)) {
      throw new BaseException(`ID: ${id} noto'g'ri formatta kiritildi!`, 400);
    }
    const user = await this.#_userModel.findById(id);
    if (!user) {
      throw new BaseException(`ID: ${id} boyicha malumot topilmadi`, 404);
    }

    let newUpdateUser = { name, email, phoneNumber };

    if (password) {
      const passwordHash = await hash(password, 10);
      newUpdateUser.password = passwordHash;
    }

    const updateUser = await this.#_userModel.findByIdAndUpdate(
      id,
      newUpdateUser,
      {
        new: true,
      }
    );
    return {
      message: "Foydalanuvchi malumotlari yangilandi",
      data: updateUser,
    };
  };

  deleteUser = async (id) => {
    if (!isValidObjectId(id)) {
      throw new BaseException(`ID: ${id} noto'g'ri kiritildi!`);
    }
    const user = await this.#_userModel.findById(id);
    if (!user) {
      throw new BaseException(`ID: ${id} boyicha malumot topilmadi`, 404);
    }

    await this.#_userModel.findOneAndDelete(id);
    return;
  };

  forgotPassword = async ({ email }) => {
    const user = await this.#_userModel.findOne({ email });

    if (!user) {
      throw new BaseException("Foydalanuvchi topilmadi", 404);
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.token = token;
    await user.save();

    const resetLink = `http://localhost:4000/pages/reset-password.html?token=${token}`;

    try {
      await sendMail({
        to: email,
        subject: "Parolni tiklash",
        html: `
        <h2>Parolni tiklash uchun tugmani bosing</h2>
        <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Reset Password</a>
      `,
      });
    } catch (error) {
      console.error("Email yuborishda xatolik:", error);
      throw new BaseException(
        "Email yuborilmadi. Iltimos keyinroq urinib ko‘ring",
        500
      );
    }

    return {
      message: "Parolni tiklash havolasi emailingizga yuborildi ✅",
    };
  };

  resetPassword = async ({ token, newPassword }) => {
    const user = await this.#_userModel.findOne({ token });

    if (!user) {
      throw new BaseException("Token noto‘g‘ri yoki eskirgan", 400);
    }

    const hashedPassword = await hash(newPassword, 10);
    user.password = hashedPassword;
    user.token = undefined;

    await user.save();

    return {
      message: "Parolingiz muvaffaqiyatli yangilandi ✅",
    };
  };
   createSeedUser = async () => {
    try {
      const existingUser = await this.#_userModel.findOne({ email: "admin@example.com" });

      if (existingUser) {
        console.log("Seed user allaqachon mavjud.");
        return;
      }

      const passwordHash = await hash("123456", 10);

      const seedUser = await this.#_userModel.create({
        name: "Admin",
        email: "Tom@gmail.com",
        password: passwordHash,
        phoneNumber: "931231223",
        role: ROLES.ADMIN,
      });

      console.log("Seed user yaratildi:", seedUser.email);
    } catch (error) {
      console.error("Seed user yaratishda xatolik:", error);
    }
  };
}
export default new UserService();
