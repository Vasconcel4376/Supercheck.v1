"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const proveedor_ctrl_1 = require("../controladores/proveedor.ctrl");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Ruta para crear un proveedor
router.post('/crear', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR'), proveedor_ctrl_1.proveedorController.crearProveedor);
// Ruta para obtener todos los proveedores
router.get('/', authMiddleware_1.autenticar, proveedor_ctrl_1.proveedorController.obtenerProveedores);
exports.default = router;
