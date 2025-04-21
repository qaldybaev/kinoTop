import { Router } from "express";
import filmController from "./film.controller.js";
import { ProtectedMiddleware } from "../../middleware/protectod.middleware.js";
import { upload } from "../../config/multer.config.js";
import { Roles } from "../../middleware/roles.middleware.js";
import { ROLES } from "../../constants/role.contant.js";

const filmRouter = Router();

filmRouter.get(
  "/films",
  ProtectedMiddleware(false),
  filmController.getAllFilms
);

filmRouter.get(
  "/films/:id",
  ProtectedMiddleware(false),
  filmController.getById
);

filmRouter.post(
  "/films",
  upload.fields([
    { name: "imageUrl", maxCount: 1 },
    { name: "videoUrl", maxCount: 1 },
  ]),
  ProtectedMiddleware(true),
  Roles([ROLES.ADMIN]),
  filmController.createFilm
);

filmRouter.patch(
  "/films/:id",
  ProtectedMiddleware(true),
  Roles([ROLES.ADMIN]),
  filmController.updateFilm
);

filmRouter.delete(
  "/films/:id",
  ProtectedMiddleware(true),
  Roles([ROLES.ADMIN]),
  filmController.deleteFilm
);

export default filmRouter;
