import { Request, Response, NextFunction } from 'express';
import { CargaUtilJWT } from '../src/utils/auth';

declare global {
  namespace Express {
    interface Request {
      usuario?: CargaUtilJWT;
    }

    interface Headers {
      authorization?: string;
    }
  }
}

declare module 'express' {
  interface Request {
    usuarioId?: number;
  }
}

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response> | void | Response;
