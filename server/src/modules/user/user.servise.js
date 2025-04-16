import { isValidObjectId } from "mongoose";
import { BaseException } from "../../exception/base.exception.js";
import userModel from "./model/user.model.js";
import { compare, hash } from "bcrypt";

class UserService {
  #_userModel;
  constructor() {
    this.#_userModel = userModel;
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
    const foundedUser = await this.#_userModel.findOne({ email });

    if (!foundedUser) {
      throw new BaseException("Foydalanuvchi topilmadi", 404);
    }
    const isMatch = await compare(password, foundedUser.password);

    if (!isMatch) {
      throw new BaseException("Parol xato kiritildi!", 400);
    }

    return {
      message: "Kirish muvaffaqiyatli ✅",
      data: foundedUser,
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
}

export default new UserService();
