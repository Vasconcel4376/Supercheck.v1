import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Bad Request',
      details: err.details,
    });
  }

  // Respuesta estándar para otros tipos de error
  return res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: err.stack || null,
  });
};

export default errorHandler;
