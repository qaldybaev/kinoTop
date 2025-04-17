import { Router } from "express";
import reviewController from "./review.controller.js";

const reviewRouter = Router();

reviewRouter
  .get("/reviews", reviewController.getAllReview)
  .post("/reviews", reviewController.createReview)
  .patch("/reviews/:id",reviewController.updateReview)
  .delete("/reviews/:id", reviewController.deleteReview);

export default reviewRouter;
