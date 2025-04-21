import { Router } from "express";
import reviewController from "./review.controller.js";
import { ProtectedMiddleware } from "../../middleware/protectod.middleware.js";

const reviewRouter = Router();

reviewRouter.get(
  "/reviews",
  ProtectedMiddleware(false),
  reviewController.getReviews
);

reviewRouter.post(
  "/reviews",
  ProtectedMiddleware(true),
  reviewController.createReview
);

reviewRouter.patch(
  "/reviews/:id",
  ProtectedMiddleware(true),
  reviewController.updateReview
);

reviewRouter.delete(
  "/reviews/:id",
  ProtectedMiddleware(true),
  reviewController.deleteReview
);

export default reviewRouter;
