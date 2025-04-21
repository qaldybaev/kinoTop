import { Router } from "express";
import saveController from "./save.controller.js";
import { ProtectedMiddleware } from "../../middleware/protectod.middleware.js";

const saveRouter = Router();

saveRouter.get("/save", ProtectedMiddleware(true), saveController.getAllSaved);

saveRouter.post("/save", ProtectedMiddleware(true), saveController.saveFilm);

saveRouter.delete(
  "/save/:id",
  ProtectedMiddleware(true),
  saveController.deleteSavedFilm
);

export default saveRouter;
