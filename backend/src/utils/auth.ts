import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import config from '../config/env';
import ApiError from './apiError';
import { RolUsuario } from '@prisma/client';

// Tipos y constantes
export type Role = keyof typeof RolUsuario;
export const Role = { ...RolUsuario } as const;

export interface CargaUtilJWT extends JwtPayload {
  id: number;
  rol: Role;
  tokenType: 'ACCESS' | 'REFRESH';
}

const tokenConfig = {
  access: {
    expiresIn: '1d',
    type: 'ACCESS' as const,
  },
  refresh: {
    expiresIn: '7d',
    type: 'REFRESH' as const,
  },
} as const;

// Middleware de autenticación
export const autenticar = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError(401, 'Autenticación requerida');
    }

    const decoded = verificarToken(token);

    if (decoded.tokenType !== 'ACCESS') {
      throw new ApiError(401, 'Tipo de token inválido');
    }

    req.usuario = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware de autorización
export const autorizar = (...rolesPermitidos: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario) throw new ApiError(401, 'No autenticado');

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      throw new ApiError(403, 'Acceso no autorizado');
    }

    next();
  };
};

// Generación de tokens
export const generarToken = (
  payload: Omit<CargaUtilJWT, 'tokenType'>,
  tokenType: keyof typeof tokenConfig = 'access'
): string => {
  try {
    if (!config.JWT_SECRET) {
      throw new ApiError(500, 'Configuración JWT inválida');
    }

    const options: SignOptions = {
      expiresIn: tokenConfig[tokenType].expiresIn,
      issuer: 'supermercado-api',
      subject: payload.id.toString(),
      algorithm: 'HS256',
    };

    return jwt.sign(
      { ...payload, tokenType: tokenConfig[tokenType].type },
      config.JWT_SECRET,
      options
    );
  } catch (error) {
    throw new ApiError(500, 'Error generando token');
  }
};

// Verificación de tokens
export const verificarToken = (token: string): CargaUtilJWT => {
  try {
    if (!config.JWT_SECRET) {
      throw new ApiError(500, 'Configuración JWT inválida');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as CargaUtilJWT;

    if (!decoded.id || !decoded.rol || !validarRol(decoded.rol)) {
      throw new ApiError(401, 'Token inválido');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Token expirado');
    }
    throw new ApiError(401, 'Token inválido');
  }
};

// Generar par de tokens
export const generarParTokens = (usuario: {
  id: number;
  rol: Role;
}): { accessToken: string; refreshToken: string } => {
  return {
    accessToken: generarToken(usuario, 'access'),
    refreshToken: generarToken(usuario, 'refresh'),
  };
};

// Validación de roles
export const validarRol = (rol: string): rol is Role => {
  return Object.values(Role).includes(rol as Role);
};
