import saveService from "./save.service.js";

class SaveController {
  #_saveServise
  constructor(){
    this.#_saveServise = saveService
  }
  getAllSaved = async (req, res, next) => {
    try {
      const userId = req.user.id
      const result = await this.#_saveServise.getAllSaved(userId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  saveFilm = async (req, res, next) => {
    try {
      const result = await this.#_saveServise.saveFilm(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteSavedFilm = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.#_saveServise.deleteSavedFilm(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}

export default new SaveController();
