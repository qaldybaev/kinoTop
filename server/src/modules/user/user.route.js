import { Router } from "express";
import userController from "./user.controller.js";
import { ValidationMiddleware } from "../../middleware/valitaion.middleware.js";
import { loginSchema, registerSchema, updateUserSchema } from "./dtos/user.dto.js";

const userRouter = Router();

userRouter
  .get("/users", userController.getAllUser)
  .get("/users/:id", userController.getElementById)
  .post("/users/register",ValidationMiddleware(registerSchema), userController.registerUser)
  .post("/users/login",ValidationMiddleware(loginSchema),userController.loginUser)
  .patch("/users/:id",ValidationMiddleware(updateUserSchema),userController.updateUser)
  .delete("/users/:id",userController.deleteUser)

export default userRouter;
