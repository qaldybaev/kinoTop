import { isValidObjectId } from "mongoose";
import categoryModel from "./model/category.model.js";
import { BaseException } from "../../exception/base.exception.js";

class CategoryServise {
  #_categoryModel;
  constructor() {
    this.#_categoryModel = categoryModel;
  }

  getAllCategorys = async () => {
    const categorys = await this.#_categoryModel.find().populate("films");

    return {
      message: "success✅",
      count: categorys.length,
      data: categorys,
    };
  };

  createCategory = async ({ name }) => {
    const newCategory = await this.#_categoryModel.create({ name });

    return {
      message: "Kategoriya muvaffaqiyatli yaratildi ✅",
      data: newCategory,
    };
  };

  updateCategory = async (id, { name }) => {
    if (!isValidObjectId(id)) {
      throw new BaseException(`ID: ${id} noto'g'ri formatta yuborildi`);
    }
    const category = await this.#_categoryModel.findById(id);
    if (!category) {
      throw new BaseException(`ID: ${id} bo'yicha kategoriya topilmadi`, 404);
    }
    const updatedCategory = await this.#_categoryModel.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    return {
      message: "Kategoriya muvaffaqiyatli yangilandi ✅",
      data: updatedCategory,
    };
  };
  deleteCategory = async (id) => {
    if (!isValidObjectId(id)) {
      throw new BaseException(`ID: ${id} noto'g'ri formatta yuborildi`);
    }
    const category = await this.#_categoryModel.findById(id);
    if (!category) {
      throw new BaseException(`ID: ${id} bo'yicha kategoriya topilmadi`, 404);
    }

    await this.#_categoryModel.findByIdAndDelete(id);

    return;
  };
}

export default new CategoryServise();
