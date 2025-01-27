import { RequestHandler } from 'express';

declare module 'express' {
  interface Request {
    usuarioId?: number;
  }
}

export type AuthMiddleware = RequestHandler<
  ParamsDictionary,
  any,
  any,
  qs.ParsedQs
>;
export type RoleMiddleware = (roles: string[]) => AuthMiddleware;
