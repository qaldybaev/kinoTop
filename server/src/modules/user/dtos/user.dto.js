import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phoneNumber: Joi.string()
    .min(9)
    .max(9)
    .pattern(
      /^(9[012345789]|6[125679]|7[0123456789]|3[3]|8[8]|2[0]|5[05])[0-9]{7}$/
    )
    .required(),
}).required();

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required();
  

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  phoneNumber: Joi.string()
    .length(9)
    .pattern(
      /^(9[012345789]|6[125679]|7[0123456789]|3[3]|8[8]|2[0]|5[05])[0-9]{7}$/
    )
    .optional(),
}).required();
