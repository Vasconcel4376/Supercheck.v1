"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autorizar = exports.autenticar = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const env_1 = __importDefault(require("../config/env"));
const auth_1 = require("../utils/auth");
const autenticar = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            throw new apiError_1.default(401, 'Autenticación requerida');
        }
        if (!env_1.default.JWT_SECRET) {
            throw new apiError_1.default(500, 'Configuración de seguridad inválida');
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET);
        // Validación adicional del token
        if (decoded.tokenType !== 'ACCESS') {
            throw new apiError_1.default(401, 'Tipo de token inválido');
        }
        if (!decoded.id || !decoded.rol || !(0, auth_1.validarRol)(decoded.rol)) {
            throw new apiError_1.default(401, 'Token corrupto');
        }
        req.usuario = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new apiError_1.default(401, 'Token expirado'));
        }
        else if (error instanceof apiError_1.default) {
            next(error);
        }
        else {
            next(new apiError_1.default(401, 'Token inválido'));
        }
    }
};
exports.autenticar = autenticar;
const autorizar = (...rolesPermitidos) => {
    return (req, res, next) => {
        try {
            if (!req.usuario)
                throw new apiError_1.default(401, 'No autenticado');
            if (!rolesPermitidos.includes(req.usuario.rol)) {
                throw new apiError_1.default(403, 'Acceso no autorizado');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.autorizar = autorizar;
