import { isValidObjectId } from "mongoose";
import filmModel from "../film/models/film.model.js";
import reviewModel from "./model/review.model.js";
import { BaseException } from "../../exception/base.exception.js";
import userModel from "../user/model/user.model.js";

class ReviewService {
  #_reviewModel;
  #_filmModel;
  #_userModel
  constructor() {
    this.#_reviewModel = reviewModel;
    this.#_filmModel = filmModel;
    this.#_userModel = userModel
  }

  getAllReview = async (query) => {
    const filter = {};
  
    if (query.filmId) {
      filter.filmId = query.filmId;
    }
  
    const reviews = await this.#_reviewModel
      .find(filter)
      .populate("userId", "name"); 
  
    return {
      message: "success ✅",
      count: reviews.length,
      data: reviews,
    };
  };
  

  createReview = async ({ comment, rating, userId, filmId }) => {
    // Foydalanuvchini ID orqali topamiz
    const user = await this.#_userModel.findById(userId);
  
    if (!user) {
      throw new Error("Foydalanuvchi topilmadi!");
    }
   
  

    const newReview = await this.#_reviewModel.create({
      comment,
      rating,
      userId,
      userName: user.name, 
      filmId,
    });
  
    
    await this.#_filmModel.findByIdAndUpdate(filmId, {
      $push: { review: newReview._id },
    });
  
    return {
      message: "Izoh qoshildi✅",
      data: newReview,
    };
  };
  

  updateReview = async (id, { comment, rating }) => {
    if (!isValidObjectId(id)) {
      throw new BaseException(`ID: ${id} noto'g'ri formatta kiritildi!`, 400);
    }

    const review = await this.#_reviewModel.findById(id);
    if (!review) {
      throw new BaseException(`ID: ${id} bo'yicha ma'lumot topilmadi`, 404);
    }
    const newReview = await this.#_reviewModel.findByIdAndUpdate(
      id,
      { comment, rating },
      { new: true }
    );

    return {
      message: "Izoh yangilandi✅",
      data: newReview,
    };
  };

  deleteReview = async (id) => {
    if (!isValidObjectId(id)) {
      throw new BaseException(`ID: ${id} noto'g'ri formatta kiritildi!`, 400);
    }

    const review = await this.#_reviewModel.findById(id);
    if (!review) {
      throw new BaseException(`ID: ${id} bo'yicha ma'lumot topilmadi`, 404);
    }

    await this.#_reviewModel.findByIdAndDelete(id);

    return;
  };
}

export default new ReviewService();
