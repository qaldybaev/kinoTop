import Joi from "joi";

export const createCategorySchema = Joi.object({
    name: Joi.string().min(4).max(50).alphanum().required()
}).required()

export const updateCategorySchema = Joi.object({
    name: Joi.string().min(4).max(50).alphanum().required()
}).required()