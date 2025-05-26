import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_SECRET,
} from "../config/jwt.config.js";

export const ProtectedMiddleware = (isProtected) => {
  return async (req, res, next) => {
    if (!isProtected) {
      req.role = "USER";
      return next();
    }

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "Tokenlar mavjud emas!" });
    }

    // Access token yo'q, faqat refresh token bor bo'lsa
    if (!accessToken && refreshToken) {
      try {
        const data = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        const newAccessToken = jwt.sign(
          { user: data.user, role: data.role },
          ACCESS_TOKEN_SECRET,
          {
            expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
            algorithm: "HS256",
          }
        );

        const newRefreshToken = jwt.sign(
          { user: data.user, role: data.role },
          REFRESH_TOKEN_SECRET,
          {
            expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
            algorithm: "HS256",
          }
        );

        // Cookie ni yangilab qo'yamiz
        res.cookie("accessToken", newAccessToken, {
          maxAge: 1000 * 60 * 15, // 15 daqiqa
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          domain: ".webhero.com.uz",
          path: "/",
        });

        res.cookie("refreshToken", newRefreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 kun
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          domain: ".webhero.com.uz",
          path: "/",
        });

        req.role = data.role;
        req.user = data.user;

        return next();
      } catch (err) {
        return res.status(401).json({ message: "Refresh token noto'g'ri yoki eskirgan" });
      }
    }

    // Access token bor bo'lsa
    try {
      const decodedData = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

      req.role = decodedData.role;
      req.user = decodedData.user;

      return next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(406).json({ message: "Token muddati eskirgan" });
      } else if (err instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({ message: "JWT token xato formatda yuborildi" });
      } else if (err instanceof jwt.NotBeforeError) {
        return res.status(409).json({ message: "Token hali ishlatilishi mumkin emas" });
      } else {
        return res.status(500).json({ message: "Noma'lum xato yuz berdi" });
      }
    }
  };
};
