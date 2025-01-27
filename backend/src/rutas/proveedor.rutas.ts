import express from 'express';
import { proveedorController } from '../controladores/proveedor.ctrl';
import { autenticar, autorizar } from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para crear un proveedor
router.post(
  '/crear',
  autenticar,
  autorizar('ADMINISTRADOR'),
  proveedorController.crearProveedor
);

// Ruta para obtener todos los proveedores
router.get('/', autenticar, proveedorController.obtenerProveedores);

export default router;
