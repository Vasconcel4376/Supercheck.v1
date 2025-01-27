"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscarUsuarios = exports.eliminarUsuario = exports.activarUsuario = exports.desactivarUsuario = exports.cambiarContraseña = exports.actualizarUsuario = exports.obtenerUsuarioActual = exports.obtenerUsuarioPorId = exports.obtenerUsuarios = exports.iniciarSesion = exports.registrarUsuario = void 0;
exports.eliminarRolDeUsuario = eliminarRolDeUsuario;
const usuarioService = __importStar(require("../servicios/usuario.svc"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const auth_1 = require("../utils/auth");
const hashPassword_1 = require("../utils/hashPassword"); // Nombre corregido
// Registrar un nuevo usuario
const registrarUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, correo, contraseña, rol } = req.body;
        // Hashear la contraseña antes de crear el usuario
        const contraseñaHasheada = yield (0, hashPassword_1.hashPassword)(contraseña);
        const nuevoUsuario = yield usuarioService.crearUsuario({
            nombre,
            correo,
            contraseña: contraseñaHasheada, // Enviar contraseña hasheada
            rol: (0, auth_1.validarRol)(rol) ? rol : 'CAJERO',
        });
        res.status(201).json(nuevoUsuario);
    }
    catch (error) {
        next(error);
    }
});
exports.registrarUsuario = registrarUsuario;
// Iniciar sesión y obtener tokens
const iniciarSesion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { correo, contraseña } = req.body;
        const usuario = yield usuarioService.obtenerUsuarioPorCorreo(correo);
        if (!usuario || !(yield (0, hashPassword_1.comparePassword)(contraseña, usuario.contraseña))) {
            throw new apiError_1.default(401, 'Credenciales inválidas');
        }
        const tokens = (0, auth_1.generarParTokens)({
            id: usuario.id,
            rol: usuario.rol,
        });
        res.json(Object.assign({ usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol,
            } }, tokens));
    }
    catch (error) {
        next(error);
    }
});
exports.iniciarSesion = iniciarSesion;
// Obtener todos los usuarios (solo para ADMIN y GERENTE)
exports.obtenerUsuarios = [
    auth_1.autenticar,
    (0, auth_1.autorizar)('ADMINISTRADOR', 'GERENTE'),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { pagina = '1', limite = '10', nombre, rol } = req.query;
            const resultado = yield usuarioService.obtenerUsuarios({
                pagina: Number(pagina),
                limite: Number(limite),
                nombre: nombre === null || nombre === void 0 ? void 0 : nombre.toString(),
                rol: rol === null || rol === void 0 ? void 0 : rol.toString(),
            });
            res.json(resultado);
        }
        catch (error) {
            next(error);
        }
    }),
];
// Obtener un usuario por ID
const obtenerUsuarioPorId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield usuarioService.obtenerUsuarioPorId(Number(req.params.id));
        res.json(usuario);
    }
    catch (error) {
        next(error);
    }
});
exports.obtenerUsuarioPorId = obtenerUsuarioPorId;
// Obtener el usuario actualmente autenticado
const obtenerUsuarioActual = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario)
            throw new apiError_1.default(401, 'No autenticado');
        const usuario = yield usuarioService.obtenerUsuarioPorId(req.usuario.id);
        res.json(usuario);
    }
    catch (error) {
        next(error);
    }
});
exports.obtenerUsuarioActual = obtenerUsuarioActual;
// Actualizar los datos de un usuario
const actualizarUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario)
            throw new apiError_1.default(401, 'No autenticado');
        const { id } = req.params;
        const datosActualizacion = req.body;
        // Validar si se está intentando cambiar el rol
        if (datosActualizacion.rol && req.usuario.rol !== 'ADMINISTRADOR') {
            throw new apiError_1.default(403, 'No autorizado para cambiar roles');
        }
        const usuarioActualizado = yield usuarioService.actualizarUsuario(Number(id), datosActualizacion, req.usuario);
        res.json(usuarioActualizado);
    }
    catch (error) {
        next(error);
    }
});
exports.actualizarUsuario = actualizarUsuario;
// Cambiar la contraseña de un usuario
const cambiarContraseña = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario)
            throw new apiError_1.default(401, 'No autenticado');
        const { contraseñaActual, nuevaContraseña } = req.body;
        yield usuarioService.cambiarContraseña(req.usuario.id, contraseñaActual, nuevaContraseña);
        res.json({ mensaje: 'Contraseña actualizada exitosamente' });
    }
    catch (error) {
        next(error);
    }
});
exports.cambiarContraseña = cambiarContraseña;
// Desactivar un usuario
const desactivarUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario)
            throw new apiError_1.default(401, 'No autenticado');
        const { id } = req.params;
        yield usuarioService.actualizarUsuario(Number(id), { activo: false }, req.usuario);
        res.json({ mensaje: 'Usuario desactivado exitosamente' });
    }
    catch (error) {
        next(error);
    }
});
exports.desactivarUsuario = desactivarUsuario;
// Activar un usuario
const activarUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario)
            throw new apiError_1.default(401, 'No autenticado');
        const { id } = req.params;
        yield usuarioService.actualizarUsuario(Number(id), { activo: true }, req.usuario);
        res.json({ mensaje: 'Usuario activado exitosamente' });
    }
    catch (error) {
        next(error);
    }
});
exports.activarUsuario = activarUsuario;
// Eliminar un usuario
const eliminarUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario)
            throw new apiError_1.default(401, 'No autenticado');
        yield usuarioService.eliminarUsuario(Number(req.params.id), req.usuario);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.eliminarUsuario = eliminarUsuario;
// Buscar usuarios por un término de búsqueda
const buscarUsuarios = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { busqueda } = req.query;
        const usuarios = yield usuarioService.buscarUsuarios((busqueda === null || busqueda === void 0 ? void 0 : busqueda.toString()) || '');
        res.json(usuarios);
    }
    catch (error) {
        next(error);
    }
});
exports.buscarUsuarios = buscarUsuarios;
function eliminarRolDeUsuario(arg0, autenticar, arg2, eliminarRolDeUsuario) {
    throw new Error('Function not implemented.');
}
