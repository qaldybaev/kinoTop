import { Router } from "express";
import filmController from "./film.controller.js";

const filmRouter = Router();

filmRouter
  .get("/films", filmController.getAllFilms)
  .post("/films", filmController.cerateFilm)
  .patch("/films/:id", filmController.updateFilm)
  .delete("/films/:id",filmController.deleteFilm)

export default filmRouter;
