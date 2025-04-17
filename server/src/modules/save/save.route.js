import { Router } from "express";
import saveController from "./save.controller.js";

const saveRouter = Router();

saveRouter
  .get("/save", saveController.getAllSaved)
  .post("/save", saveController.saveFilm)
  .delete("/save/:id", saveController.deleteSavedFilm);

export default saveRouter;
