"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registroAuditoria_ctrl_1 = require("../controladores/registroAuditoria.ctrl");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Ruta para crear un registro de auditoría
router.post('/crear', authMiddleware_1.autenticar, (0, authMiddleware_1.autorizar)('ADMINISTRADOR'), registroAuditoria_ctrl_1.registroAuditoriaController.crearRegistroAuditoria);
// Ruta para obtener todos los registros de auditoría
router.get('/', authMiddleware_1.autenticar, registroAuditoria_ctrl_1.registroAuditoriaController.obtenerRegistrosAuditoria);
exports.default = router;
