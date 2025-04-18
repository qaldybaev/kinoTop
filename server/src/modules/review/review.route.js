import { Router } from "express";
import reviewController from "./review.controller.js";
import { ProtectedMiddleware } from "../../middleware/protectod.middleware.js";

const reviewRouter = Router();

reviewRouter
  .get("/reviews", ProtectedMiddleware(false), reviewController.getAllReview)
  .post("/reviews", ProtectedMiddleware(false), reviewController.createReview)
  .patch(
    "/reviews/:id",
    ProtectedMiddleware(false),
    reviewController.updateReview
  )
  .delete(
    "/reviews/:id",
    ProtectedMiddleware(false),
    reviewController.deleteReview
  );

export default reviewRouter;
