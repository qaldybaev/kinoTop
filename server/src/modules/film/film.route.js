import { Router } from "express";
import filmController from "./film.controller.js";
import { ProtectedMiddleware } from "../../middleware/protectod.middleware.js";

const filmRouter = Router();

filmRouter
  .get("/films", ProtectedMiddleware(false), filmController.getAllFilms)
  .post("/films", ProtectedMiddleware(true), filmController.cerateFilm)
  .patch("/films/:id", ProtectedMiddleware(true), filmController.updateFilm)
  .delete("/films/:id", ProtectedMiddleware(true), filmController.deleteFilm);

export default filmRouter;
