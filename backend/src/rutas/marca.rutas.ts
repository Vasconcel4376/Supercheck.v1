import express from 'express';
import { marcaController } from '../controladores/marca.ctrl';
import { autenticar, autorizar } from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para crear una nueva marca
router.post(
  '/crear',
  autenticar,
  autorizar('ADMINISTRADOR'),
  marcaController.crearMarca
);

// Ruta para obtener todas las marcas
router.get('/', autenticar, marcaController.obtenerMarcas);

export default router;
