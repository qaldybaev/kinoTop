import { Router } from "express";
import saveController from "./save.controller.js";
import { ProtectedMiddleware } from "../../middleware/protectod.middleware.js";

const saveRouter = Router();

saveRouter
  .get("/save", ProtectedMiddleware(false), saveController.getAllSaved)
  .post("/save", ProtectedMiddleware(false), saveController.saveFilm)
  .delete(
    "/save/:id",
    ProtectedMiddleware(false),
    saveController.deleteSavedFilm
  );

export default saveRouter;
