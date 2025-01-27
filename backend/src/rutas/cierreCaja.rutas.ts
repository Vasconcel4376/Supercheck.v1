import express from 'express';
import { cierreCajaController } from '../controladores/cierreCaja.ctrl';
import { autenticar, autorizar } from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para crear un cierre de caja
router.post(
  '/crear',
  autenticar,
  autorizar('ADMINISTRADOR'),
  cierreCajaController.crearCierreCaja
);

// Ruta para obtener todos los cierres de caja
router.get('/', autenticar, cierreCajaController.obtenerCierres);

// Ruta para cerrar una caja
router.post(
  '/cerrar/:cierreCajaId',
  autenticar,
  autorizar('ADMINISTRADOR'),
  cierreCajaController.cerrarCaja
);

// Ruta para cerrar una caja automáticamente al final del turno
router.post(
  '/cerrar-automatico/:usuarioId',
  autenticar,
  autorizar('CAJERO'),
  cierreCajaController.cierreAutomatico
);

// Ruta para cerrar una caja manualmente en caso de emergencia
router.post(
  '/cerrar-manual/:usuarioId',
  autenticar,
  autorizar('ADMINISTRADOR'),
  cierreCajaController.cierreManual
);

export default router;
