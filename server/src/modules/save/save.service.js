import saveModel from "./model/save.model.js";
import { isValidObjectId } from "mongoose";
import { BaseException } from "../../exception/base.exception.js";

class SaveService {
  #_saveModel;
  constructor() {
    this.#_saveModel = saveModel;
  }

  getAllSaved = async () => {
    const saves = await this.#_saveModel.find().populate("userId filmId");
    return {
      message: "Saqlanganlar ro'yxati✅",
      count: saves.length,
      data: saves,
    };
  };

  saveFilm = async ({ userId, filmId }) => {
    const newsave = await this.#_saveModel.findOne({ userId, filmId });
    if (newsave) {
      throw new BaseException("Bu film allaqachon saqlangan!", 400);
    }

    const newSave = await this.#_saveModel.create({ userId, filmId });
    return {
      message: "Film saqlandi✅",
      data: newSave,
    };
  };

  deleteSavedFilm = async (id) => {
    if (!isValidObjectId(id)) {
      throw new BaseException("ID noto'g'ri formatta kiritilgan!", 400);
    }

    const deleted = await this.#_saveModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new BaseException("Saqlangan film topilmadi!", 404);
    }

    return;
  };
}

export default new SaveService();
