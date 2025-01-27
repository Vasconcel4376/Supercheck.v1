import express from 'express';
import { productoController } from '../controladores/producto.ctrl';
import { autenticar, autorizar } from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para crear un producto
router.post(
  '/crear',
  autenticar,
  autorizar('ADMINISTRADOR'),
  productoController.crearProducto
);

// Ruta para obtener todos los productos
router.get('/', autenticar, productoController.obtenerProductos);

export default router;
