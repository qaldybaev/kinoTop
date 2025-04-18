import { ROLES } from "../constants/role.contant.js";
import { BaseException } from "../exception/base.exception.js";

export const Roles = (...roles) => {
  return (req, _, next) => {
    const userRole = req.role;

    if (roles.includes(ROLES.ALL)) {
      return next();
    }

    if (!roles.includes(userRole)) {
      return next(
        new BaseException("Sizga bu amalni bajarishga ruhsat yo'q", 403)
      );
    }

    next();
  };
};