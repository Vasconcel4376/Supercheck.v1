"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const producto_ctrl_1 = require("../controladores/producto.ctrl");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Ruta para crear un producto
router.post('/crear', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR'), producto_ctrl_1.productoController.crearProducto);
// Ruta para obtener todos los productos
router.get('/', authMiddleware_1.autenticar, producto_ctrl_1.productoController.obtenerProductos);
exports.default = router;
