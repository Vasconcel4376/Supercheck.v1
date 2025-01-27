// src/middleware/roleMiddleware.ts

import { Request, Response, NextFunction } from 'express';

const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
  };
};

export default roleMiddleware;
