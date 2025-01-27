"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const marca_ctrl_1 = require("../controladores/marca.ctrl");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Ruta para crear una nueva marca
router.post('/crear', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR'), marca_ctrl_1.marcaController.crearMarca);
// Ruta para obtener todas las marcas
router.get('/', authMiddleware_1.autenticar, marca_ctrl_1.marcaController.obtenerMarcas);
exports.default = router;
