import categoryServise from "./category.service.js";

class CategoryController {
  #_categoryServise;
  constructor() {
    this.#_categoryServise = categoryServise;
  }

  getAllCategory = async (req, res, next) => {
    try {
      const data = await this.#_categoryServise.getAllCategorys();
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req, res, next) => {
    try {
      const data = await this.#_categoryServise.createCategory(req.body);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };
  updateCategory = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.#_categoryServise.updateCategory(id, req.body);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.#_categoryServise.deleteCategory(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default new CategoryController();
