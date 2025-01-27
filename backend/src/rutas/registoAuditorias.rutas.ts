import express from 'express';
import { registroAuditoriaController } from '../controladores/registroAuditoria.ctrl';
import { autenticar, autorizar } from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para crear un registro de auditoría
router.post(
  '/crear',
  autenticar,
  autorizar('ADMINISTRADOR'),
  registroAuditoriaController.crearRegistroAuditoria
);

// Ruta para obtener todos los registros de auditoría
router.get(
  '/',
  autenticar,
  registroAuditoriaController.obtenerRegistrosAuditoria
);

export default router;
