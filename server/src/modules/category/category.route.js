import { Router } from "express";
import categoryController from "./category.controller.js";

const categoryRouter = Router();

categoryRouter
  .get("/categorys", categoryController.getAllCategory)
  .post("/categorys", categoryController.createCategory)
  .put("/categorys/:id", categoryController.updateCategory)
  .delete("/categorys/:id", categoryController.deleteCategory);

export default categoryRouter;
