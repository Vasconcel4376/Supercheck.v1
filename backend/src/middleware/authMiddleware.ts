import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError';
import config from '../config/env';
import { CargaUtilJWT, validarRol } from '../utils/auth';

declare module 'express' {
  interface Request {
    usuario?: CargaUtilJWT;
  }
}

export const autenticar = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError(401, 'Autenticación requerida');
    }

    if (!config.JWT_SECRET) {
      throw new ApiError(500, 'Configuración de seguridad inválida');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as CargaUtilJWT;

    // Validación adicional del token
    if (decoded.tokenType !== 'ACCESS') {
      throw new ApiError(401, 'Tipo de token inválido');
    }

    if (!decoded.id || !decoded.rol || !validarRol(decoded.rol)) {
      throw new ApiError(401, 'Token corrupto');
    }

    req.usuario = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, 'Token expirado'));
    } else if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, 'Token inválido'));
    }
  }
};

export const autorizar = (...rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.usuario) throw new ApiError(401, 'No autenticado');

      if (!rolesPermitidos.includes(req.usuario.rol)) {
        throw new ApiError(403, 'Acceso no autorizado');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
