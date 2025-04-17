const errorHandlerMiddleware = (error, req, res, next) => {
    const statusCode = error.status || 500;
  
    res.status(statusCode).json({
      status:"error❌",
      message: error.message || "Serverda xatolik yuz berdi",
    });
  };
  
  export default errorHandlerMiddleware;
  