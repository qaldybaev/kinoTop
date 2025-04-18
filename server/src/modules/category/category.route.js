import { Router } from "express";
import categoryController from "./category.controller.js";
import { ValidationMiddleware } from "../../middleware/valitaion.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./dtos/category.dto.js";
import { ProtectedMiddleware } from "../../middleware/protectod.middleware.js";
import { Roles } from "../../middleware/roles.middleware.js";
import { ROLES } from "../../constants/role.contant.js";

const categoryRouter = Router();

categoryRouter
  .get(
    "/categorys",
    ProtectedMiddleware(false),
    categoryController.getAllCategory
  )
  .post(
    "/categorys",
    ProtectedMiddleware(true),
    ValidationMiddleware(createCategorySchema),
    categoryController.createCategory
  )
  .put(
    "/categorys/:id",
    ProtectedMiddleware(true),
    ValidationMiddleware(updateCategorySchema),
    categoryController.updateCategory
  )
  .delete(
    "/categorys/:id",
    ProtectedMiddleware(true),
    categoryController.deleteCategory
  );

export default categoryRouter;
