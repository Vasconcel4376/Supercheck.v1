import express from 'express';
import { ingresoStockController } from '../controladores/ingresoStock.ctrl';
import { autenticar, autorizar } from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para crear un ingreso de stock
router.post(
  '/crear',
  autenticar,
  autorizar('ADMINISTRADOR'),
  ingresoStockController.crearIngreso
);

// Ruta para obtener todos los ingresos de stock
router.get('/', autenticar, ingresoStockController.obtenerIngresos);

export default router;
