"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cierreCaja_ctrl_1 = require("../controladores/cierreCaja.ctrl");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Ruta para crear un cierre de caja
router.post('/crear', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR'), cierreCaja_ctrl_1.cierreCajaController.crearCierreCaja);
// Ruta para obtener todos los cierres de caja
router.get('/', authMiddleware_1.autenticar, cierreCaja_ctrl_1.cierreCajaController.obtenerCierres);
// Ruta para cerrar una caja
router.post('/cerrar/:cierreCajaId', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR'), cierreCaja_ctrl_1.cierreCajaController.cerrarCaja);
// Ruta para cerrar una caja automáticamente al final del turno
router.post('/cerrar-automatico/:usuarioId', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('CAJERO'), cierreCaja_ctrl_1.cierreCajaController.cierreAutomatico);
// Ruta para cerrar una caja manualmente en caso de emergencia
router.post('/cerrar-manual/:usuarioId', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR'), cierreCaja_ctrl_1.cierreCajaController.cierreManual);
exports.default = router;
