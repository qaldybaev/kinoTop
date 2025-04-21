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

  getAllFilm = async (page = 1, sortBy = 'title', order = 'asc', categoryId = '', query = '') => {
  
    // Page va order validatsiyasi
    if (!Number.isInteger(page) || page <= 0) {
      throw new BaseException(`Page ${page} xato kiritildi`, 400);
    }
    if (!['asc', 'desc'].includes(order)) {
      throw new BaseException(`Order ${order} xato kiritildi`, 400);
    }
  
    const skip = (page - 1) * 8; // Skipni hisoblash
    const sortOrder = order === 'asc' ? 1 : -1;
  
    // Filtrlar
    const filter = {};
    if (categoryId) filter.category = categoryId;
    if (query) filter.title = { $regex: query, $options: 'i' };
  
    // Filmlarni olish
    const films = await this.#_filmModel.find(filter)
      .populate({
        path: "review",
        select: "comment rating userId createdAt",
      })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(8);
  
    const totalFilms = await this.#_filmModel.countDocuments(filter);
    const totalPages = Math.ceil(totalFilms / 8); 
    console.log(totalPages)
  
    return {
      message: "success✅",
      count: films.length,
      total:totalFilms,
      totalPages, 
      currentPage: page, 
      data: films, 
    };
  };
  
  getById = async (id) => {
    if (!isValidObjectId(id)) {
      throw new BaseException(`ID: ${id} noto'g'ri formatta kiritildi!`, 400);
    }

    const films = await this.#_filmModel.findById(id);
    if (!films) {
      throw new BaseException(`ID: ${id} bo'yicha ma'lumot topilmadi`, 404);
    }
    const film = await this.#_filmModel.findById(id).populate({
      path: "review",
      select: "comment rating userId createdAt",
    });

    return {
      message: "success✅",
      data: film,
    };
  };

  createFilm = async (image,video,{
    title,
    description,
    year,
    imageUrl,
    videoUrl,
    categoryId,
  }) => {
    try {
     

      const newFilm = await this.#_filmModel.create({
        title,
        description,
        year,
        imageUrl: `/uploads/images/${image[0].filename}`, 
      videoUrl: `/uploads/videos/${video[0].filename}`, 
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
    } catch (error) {
      console.error("Film yaratishda xatolik:", error);
      throw new Error("Film yaratishda xatolik yuz berdi.");
    }
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

  deleteFilm = async (id) => {
    if (!isValidObjectId(id)) {
      throw new BaseException(`ID: ${id} noto'g'ri formatta kiritildi!`, 400);
    }

    const film = await this.#_filmModel.findById(id);
    if (!film) {
      throw new BaseException(`ID: ${id} bo'yicha ma'lumot topilmadi`, 404);
    }

    await this.#_filmModel.findByIdAndDelete(id);

    return;
  };
}

export default new FilmServise();
