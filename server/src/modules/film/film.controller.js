import filmServise from "./film.service.js";

class FilmController {
  #_filmServise;
  constructor() {
    this.#_filmServise = filmServise;
  }

  getAllFilms = async (req, res, next) => {
    try {
      const { page = 1, sortBy = 'title', order = 'asc', categoryId = '', query = '' } = req.query;
      console.log(req.query)
     
      const data = await this.#_filmServise.getAllFilm(
        parseInt(page), 
        sortBy, 
        order, 
        categoryId, 
        query
      );
  
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };
  
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.#_filmServise.getById(id);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  createFilm = async (req, res, next) => {
    try {
      const image = req.files["imageUrl"];
      const video = req.files["videoUrl"];

      if (!image || !video) {
        return res
          .status(400)
          .send({ error: "Iltimos, rasm va video fayllarini yuboring!" });
      }

      const data = await this.#_filmServise.createFilm(image, video, req.body);

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
