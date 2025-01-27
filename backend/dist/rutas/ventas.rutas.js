"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ventas_ctrl_1 = require("../controladores/ventas.ctrl");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Ruta para crear una nueva venta
router.post('/crear', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('CAJERO'), ventas_ctrl_1.ventaController.crearVenta);
// Ruta para obtener todas las ventas
router.get('/', authMiddleware_1.autenticar, ventas_ctrl_1.ventaController.obtenerVentas);
exports.default = router;
