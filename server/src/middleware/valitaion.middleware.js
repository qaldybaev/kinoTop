import { BaseException } from "../exception/base.exception.js";

export const ValidationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body);

      if (error) {
        throw new BaseException(error.message, 400);
      }

      req.body = value;
      next();
    } catch (error) {
      next(error);
    }
  };
};
