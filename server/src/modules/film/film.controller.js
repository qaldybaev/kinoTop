import filmServise from "./film.service.js";

class FilmController {
  #_filmServise;
  constructor() {
    this.#_filmServise = filmServise;
  }

  getAllFilms = async (req, res, next) => {
    try {
      const data = await this.#_filmServise.getAllFilm();
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  cerateFilm = async (req, res, next) => {
    try {
      const data = await this.#_filmServise.createFilm(req.body);
      res.status(201).send(data);
    } catch (error) {
      next(error);
    }
  };

  updateFilm = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.#_filmServise.updateFilm(id, req.body);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  deleteFilm = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.#_filmServise.deleteFilm(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default new FilmController();
