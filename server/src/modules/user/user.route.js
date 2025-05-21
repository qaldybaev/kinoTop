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

userRouter.get(
  "/users",
  ProtectedMiddleware(true),
  Roles([ROLES.ADMIN]),
  userController.getAllUser
);

userRouter.get(
  "/users/:id",
  ProtectedMiddleware(true),
  Roles([ROLES.ADMIN]),
  userController.getElementById
);

userRouter.post(
  "/users/register",
  ProtectedMiddleware(false),
  ValidationMiddleware(registerSchema),
  userController.registerUser
);

userRouter.post(
  "/users/login",
  ProtectedMiddleware(false),
  ValidationMiddleware(loginSchema),
  userController.loginUser
);

userRouter.patch(
  "/users/:id",
  ProtectedMiddleware(true),
  Roles([ROLES.ADMIN, ROLES.USER]),
  ValidationMiddleware(updateUserSchema),
  userController.updateUser
);

userRouter.delete(
  "/users/:id",
  ProtectedMiddleware(true),
  Roles([ROLES.ADMIN]),
  userController.deleteUser
);

userRouter.post(
  "/forgot-password",
  ProtectedMiddleware(false),
  userController.forgotPassword
);

userRouter.post(
  "/reset-password",
  ProtectedMiddleware(false),
  userController.resetPassword
);

export default userRouter;
