import express from 'express';
import { ventaController } from '../controladores/ventas.ctrl';
import { autenticar, autorizar } from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para crear una nueva venta
router.post(
  '/crear',
  autenticar,
  autorizar('CAJERO'),
  ventaController.crearVenta
);

// Ruta para obtener todas las ventas
router.get('/', autenticar, ventaController.obtenerVentas);

export default router;
