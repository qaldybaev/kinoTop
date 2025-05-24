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

categoryRouter.get(
  "/categorys",
  ProtectedMiddleware(false),Roles(ROLES.ALL),
  categoryController.getAllCategory
);

categoryRouter.post(
  "/categorys",
  ValidationMiddleware(createCategorySchema),
  ProtectedMiddleware(true),
  Roles([ROLES.ADMIN]),
  categoryController.createCategory
);

categoryRouter.put(
  "/categorys/:id",
  ProtectedMiddleware(true),
  Roles([ROLES.ADMIN]),
  ValidationMiddleware(updateCategorySchema),
  categoryController.updateCategory
);

categoryRouter.delete(
  "/categorys/:id",
  ProtectedMiddleware(true),
  Roles([ROLES.ADMIN]),
  categoryController.deleteCategory
);

export default categoryRouter;
