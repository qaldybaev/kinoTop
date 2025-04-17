import reviewService from "./review.service.js";

class ReviewController {
  #_reviewService;
  constructor() {
    this.#_reviewService = reviewService;
  }

  getAllReview = async (req, res, next) => {
    try {
      const data = await this.#_reviewService.getAllReview();

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  createReview = async (req, res, next) => {
    try {
      const data = await this.#_reviewService.createReview(req.body);

      res.status(201).send(data);
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req, res, next) => {
    try {
        const {id} = req.params
      const data = await this.#_reviewService.updateReview(id,req.body);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  deleteReview = async (req, res, next) => {
    const { id } = req.params;

    await this.#_reviewService.deleteReview(id);

    res.status(204).send();
  };
}
export default new ReviewController();
