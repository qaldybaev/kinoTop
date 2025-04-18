import { isValidObjectId } from "mongoose";
import { BaseException } from "../../exception/base.exception.js";
import categoryModel from "../category/model/category.model.js";
import filmModel from "./models/film.model.js";

class FilmServise {
  #_filmModel;
  #_categoryModel;
  constructor() {
    this.#_filmModel = filmModel;
    this.#_categoryModel = categoryModel;
  }

  getAllFilm = async () => {
    const films = await this.#_filmModel.find()
      .populate({
        path: "review",
        select: "comment rating userId createdAt",
      });
  
    return {
      message: "success✅",
      count: films.length,
      data: films,
    };
  };
  

  createFilm = async ({
    title,
    description,
    year,
    imageUrl,
    videoUrl,
    categoryId,
  }) => {
    const newFilm = await this.#_filmModel.create({
      title,
      description,
      year,
      imageUrl,
      videoUrl,
      category: categoryId,
    });

    await this.#_categoryModel.updateOne(
      { _id: categoryId },
      {
        $push: { films: newFilm._id },
      }
    );

    return {
      message: "Yangi film yaratildi✅",
      data: newFilm,
    };
  };

  updateFilm = async (id, { title, description, year, imageUrl, videoUrl }) => {
    if (!isValidObjectId(id)) {
      throw new BaseException(`ID: ${id} noto'g'ri formatta kiritildi!`, 400);
    }

    const film = await this.#_filmModel.findById(id);
    if (!film) {
      throw new BaseException(`ID: ${id} bo'yicha ma'lumot topilmadi`, 404);
    }

    const updatedFilm = await this.#_filmModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        year,
        imageUrl,
        videoUrl,
      },
      { new: true }
    );

    return {
      message: "Film yangilandi✅",
      data: updatedFilm,
    };
  };

  deleteFilm = async(id) => {

    if (!isValidObjectId(id)) {
        throw new BaseException(`ID: ${id} noto'g'ri formatta kiritildi!`, 400);
      }
  
      const film = await this.#_filmModel.findById(id);
      if (!film) {
        throw new BaseException(`ID: ${id} bo'yicha ma'lumot topilmadi`, 404);
      }

      await this.#_filmModel.findByIdAndDelete(id)

      return;
  }
}

export default new FilmServise();
