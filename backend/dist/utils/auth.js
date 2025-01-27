"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarRol = exports.generarParTokens = exports.verificarToken = exports.generarToken = exports.autorizar = exports.autenticar = exports.Role = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const apiError_1 = __importDefault(require("./apiError"));
const client_1 = require("@prisma/client");
exports.Role = Object.assign({}, client_1.RolUsuario);
const tokenConfig = {
    access: {
        expiresIn: '1d',
        type: 'ACCESS',
    },
    refresh: {
        expiresIn: '7d',
        type: 'REFRESH',
    },
};
// Middleware de autenticación
const autenticar = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            throw new apiError_1.default(401, 'Autenticación requerida');
        }
        const decoded = (0, exports.verificarToken)(token);
        if (decoded.tokenType !== 'ACCESS') {
            throw new apiError_1.default(401, 'Tipo de token inválido');
        }
        req.usuario = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.autenticar = autenticar;
// Middleware de autorización
const autorizar = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario)
            throw new apiError_1.default(401, 'No autenticado');
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            throw new apiError_1.default(403, 'Acceso no autorizado');
        }
        next();
    };
};
exports.autorizar = autorizar;
// Generación de tokens
const generarToken = (payload, tokenType = 'access') => {
    try {
        if (!env_1.default.JWT_SECRET) {
            throw new apiError_1.default(500, 'Configuración JWT inválida');
        }
        const options = {
            expiresIn: tokenConfig[tokenType].expiresIn,
            issuer: 'supermercado-api',
            subject: payload.id.toString(),
            algorithm: 'HS256',
        };
        return jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, payload), { tokenType: tokenConfig[tokenType].type }), env_1.default.JWT_SECRET, options);
    }
    catch (error) {
        throw new apiError_1.default(500, 'Error generando token');
    }
};
exports.generarToken = generarToken;
// Verificación de tokens
const verificarToken = (token) => {
    try {
        if (!env_1.default.JWT_SECRET) {
            throw new apiError_1.default(500, 'Configuración JWT inválida');
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET);
        if (!decoded.id || !decoded.rol || !(0, exports.validarRol)(decoded.rol)) {
            throw new apiError_1.default(401, 'Token inválido');
        }
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new apiError_1.default(401, 'Token expirado');
        }
        throw new apiError_1.default(401, 'Token inválido');
    }
};
exports.verificarToken = verificarToken;
// Generar par de tokens
const generarParTokens = (usuario) => {
    return {
        accessToken: (0, exports.generarToken)(usuario, 'access'),
        refreshToken: (0, exports.generarToken)(usuario, 'refresh'),
    };
};
exports.generarParTokens = generarParTokens;
// Validación de roles
const validarRol = (rol) => {
    return Object.values(exports.Role).includes(rol);
};
exports.validarRol = validarRol;
