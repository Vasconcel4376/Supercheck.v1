"use strict";
// src/middleware/roleMiddleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.usuario || !roles.includes(req.usuario.rol)) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        next();
    };
};
exports.default = roleMiddleware;
