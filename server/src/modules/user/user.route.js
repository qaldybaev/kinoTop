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

// Barcha foydalanuvchilarni olish - faqat admin uchun
userRouter.get(
  "/users",
  ProtectedMiddleware(true), // Foydalanuvchi autentifikatsiya qilingan bo'lishi kerak
  Roles([ROLES.ADMIN]), // Faqat adminlar uchun
  userController.getAllUser
);

// Foydalanuvchi ma'lumotlarini olish - faqat adminlar uchun
userRouter.get(
  "/users/:id",
  ProtectedMiddleware(true), // Foydalanuvchi autentifikatsiya qilingan bo'lishi kerak
  Roles([ROLES.ADMIN]), // Faqat adminlar uchun
  userController.getElementById
);

// Foydalanuvchini ro'yxatdan o'tkazish - har kim uchun ochiq
userRouter.post(
  "/users/register",
  ProtectedMiddleware(false), // Ro'yxatga olish uchun autentifikatsiya kerak emas
  ValidationMiddleware(registerSchema), // Yangi foydalanuvchi ma'lumotlarini tekshirish
  userController.registerUser
);

// Foydalanuvchi tizimga kirish - har kim uchun ochiq
userRouter.post(
  "/users/login",
  ProtectedMiddleware(false), // Kirish uchun autentifikatsiya kerak emas
  ValidationMiddleware(loginSchema), // Login uchun ma'lumotlarni tekshirish
  userController.loginUser
);

// Foydalanuvchini yangilash - faqat autentifikatsiyalangan foydalanuvchi va adminlar uchun
userRouter.patch(
  "/users/:id",
  ProtectedMiddleware(true), // Foydalanuvchi autentifikatsiya qilingan bo'lishi kerak
  Roles([ROLES.ADMIN, ROLES.USER]), // Faqat adminlar va o'z foydalanuvchilari uchun
  ValidationMiddleware(updateUserSchema), // Foydalanuvchi yangilanishini tekshirish
  userController.updateUser
);

// Foydalanuvchini o'chirish - faqat adminlar uchun
userRouter.delete(
  "/users/:id",
  ProtectedMiddleware(true), // Foydalanuvchi autentifikatsiya qilingan bo'lishi kerak
  Roles([ROLES.ADMIN]), // Faqat adminlar uchun
  userController.deleteUser
);

// Parolni unutgan foydalanuvchilar uchun - har kim uchun ochiq
userRouter.post(
  "/forgot-password",
  ProtectedMiddleware(false), // Parolni tiklash uchun autentifikatsiya kerak emas
  userController.forgotPassword
);

// Parolni tiklash - har kim uchun ochiq
userRouter.post(
  "/reset-password",
  ProtectedMiddleware(false), // Parolni tiklash uchun autentifikatsiya kerak emas
  userController.resetPassword
);

export default userRouter;
