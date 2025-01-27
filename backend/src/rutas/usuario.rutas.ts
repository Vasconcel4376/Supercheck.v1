import express from 'express';
import * as usuarioController from '../controladores/usuario.ctrl';
import { autenticar, autorizar } from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para registrar un nuevo usuario (solo ADMIN)
router.post(
  '/usuarios',
  autenticar,
  autorizar('ADMINISTRADOR'),
  usuarioController.registrarUsuario
);

// Ruta para iniciar sesión
router.post('/login', usuarioController.iniciarSesion);

// Ruta para obtener los datos de un usuario por ID (solo ADMIN o el propio usuario)
router.get('/usuarios/:id', autenticar, usuarioController.obtenerUsuarioPorId);

// Ruta para obtener el usuario autenticado
router.get('/me', autenticar, usuarioController.obtenerUsuarioActual);

// Ruta para obtener todos los usuarios (solo ADMIN y GERENTE)
router.get(
  '/usuarios',
  autenticar,
  autorizar('ADMINISTRADOR', 'GERENTE'),
  usuarioController.obtenerUsuarios
);

// Ruta para actualizar los datos de un usuario (solo ADMIN o el propio usuario)
router.put(
  '/usuarios/:id',
  autenticar,
  autorizar('ADMINISTRADOR'),
  usuarioController.actualizarUsuario
);

// Ruta para cambiar la contraseña del usuario (solo el propio usuario)
router.put(
  '/usuarios/:id/cambiarContraseña',
  autenticar,
  usuarioController.cambiarContraseña
);

// Ruta para desactivar un usuario (solo ADMIN)
router.put(
  '/usuarios/:id/desactivar',
  autenticar,
  autorizar('ADMINISTRADOR'),
  usuarioController.desactivarUsuario
);

// Ruta para activar un usuario (solo ADMIN)
router.put(
  '/usuarios/:id/activar',
  autenticar,
  autorizar('ADMINISTRADOR'),
  usuarioController.activarUsuario
);

// Ruta para eliminar un usuario (solo ADMIN)
router.delete(
  '/usuarios/:id',
  autenticar,
  autorizar('ADMINISTRADOR'),
  usuarioController.eliminarUsuario
);

// Ruta para buscar usuarios (solo ADMIN y GERENTE)
router.get(
  '/usuarios/buscar',
  autenticar,
  autorizar('ADMINISTRADOR', 'GERENTE'),
  usuarioController.buscarUsuarios
);

export default router;
