import logger from "../config/winston.config.js";

const errorHandlerMiddleware = (error, req, res, next) => {

  logger.error(error.message);
  console.error(error.stack);

  if (error?.code === 11000) {
    return res.status(409).json({
      status: "error",
      message: "Bu ma'lumot avvaldan mavjud",
    });
  }

  if (error.isException) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  res.status(500).json({
    status: "error",
    message: error.message || "Serverda xatolik yuz berdi",
  });
};

export default errorHandlerMiddleware;
