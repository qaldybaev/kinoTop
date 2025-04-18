import { Router } from "express";
import userController from "./user.controller.js";
import { ValidationMiddleware } from "../../middleware/valitaion.middleware.js";
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
} from "./dtos/user.dto.js";
import { ProtectedMiddleware } from "../../middleware/protectod.middleware.js";
import { Roles } from "../../middleware/roles.middleware.js";
import { ROLES } from "../../constants/role.contant.js";

const userRouter = Router();

userRouter
  .get("/users", ProtectedMiddleware(true), userController.getAllUser)
  .get(
    "/users/:id",
    ProtectedMiddleware(true),
    Roles([ROLES.ADMIN]),
    userController.getElementById
  )
  .post(
    "/users/register",
    ProtectedMiddleware(false),
    ValidationMiddleware(registerSchema),
    userController.registerUser
  )
  .post(
    "/users/login",
    ProtectedMiddleware(false),
    ValidationMiddleware(loginSchema),
    userController.loginUser
  )
  .patch(
    "/users/:id",
    ProtectedMiddleware(true),
    ValidationMiddleware(updateUserSchema),
    userController.updateUser
  )
  .delete("/users/:id", ProtectedMiddleware(true), userController.deleteUser);

export default userRouter;
