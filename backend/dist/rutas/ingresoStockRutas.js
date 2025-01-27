"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ingresoStock_ctrl_1 = require("../controladores/ingresoStock.ctrl");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Ruta para crear un ingreso de stock
router.post('/crear', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR'), ingresoStock_ctrl_1.ingresoStockController.crearIngreso);
// Ruta para obtener todos los ingresos de stock
router.get('/', authMiddleware_1.autenticar, ingresoStock_ctrl_1.ingresoStockController.obtenerIngresos);
exports.default = router;
