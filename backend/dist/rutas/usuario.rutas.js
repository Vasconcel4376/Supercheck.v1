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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usuarioController = __importStar(require("../controladores/usuario.ctrl"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Ruta para registrar un nuevo usuario (solo ADMIN)
router.post('/usuarios', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR'), usuarioController.registrarUsuario);
// Ruta para iniciar sesión
router.post('/login', usuarioController.iniciarSesion);
// Ruta para obtener los datos de un usuario por ID (solo ADMIN o el propio usuario)
router.get('/usuarios/:id', authMiddleware_1.autenticar, usuarioController.obtenerUsuarioPorId);
// Ruta para obtener el usuario autenticado
router.get('/me', authMiddleware_1.autenticar, usuarioController.obtenerUsuarioActual);
// Ruta para obtener todos los usuarios (solo ADMIN y GERENTE)
router.get('/usuarios', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR', 'GERENTE'), usuarioController.obtenerUsuarios);
// Ruta para actualizar los datos de un usuario (solo ADMIN o el propio usuario)
router.put('/usuarios/:id', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR'), usuarioController.actualizarUsuario);
// Ruta para cambiar la contraseña del usuario (solo el propio usuario)
router.put('/usuarios/:id/cambiarContraseña', authMiddleware_1.autenticar, usuarioController.cambiarContraseña);
// Ruta para desactivar un usuario (solo ADMIN)
router.put('/usuarios/:id/desactivar', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR'), usuarioController.desactivarUsuario);
// Ruta para activar un usuario (solo ADMIN)
router.put('/usuarios/:id/activar', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR'), usuarioController.activarUsuario);
// Ruta para eliminar un usuario (solo ADMIN)
router.delete('/usuarios/:id', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR'), usuarioController.eliminarUsuario);
// Ruta para buscar usuarios (solo ADMIN y GERENTE)
router.get('/usuarios/buscar', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR', 'GERENTE'), usuarioController.buscarUsuarios);
exports.default = router;
