import { isValidObjectId } from "mongoose";
import filmModel from "../film/models/film.model.js";
import reviewModel from "./model/review.model.js";
import { BaseException } from "../../exception/base.exception.js";

class ReviewService {
  #_reviewModel;
  #_filmModel;
  constructor() {
    this.#_reviewModel = reviewModel;
    this.#_filmModel = filmModel;
  }

  getAllReview = async () => {
    const reviews = await this.#_reviewModel.find();

    return {
      message: "success✅",
      count: reviews.length,
      data: reviews,
    };
  };

  createReview = async ({ comment, rating, userId, filmId }) => {
    const newReview = await this.#_reviewModel.create({
      comment,
      rating,
      userId,
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
