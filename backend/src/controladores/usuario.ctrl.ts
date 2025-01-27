import { Request, Response, NextFunction } from 'express';
import * as usuarioService from '../servicios/usuario.svc';
import ApiError from '../utils/apiError';
import {
  generarParTokens,
  autenticar,
  autorizar,
  Role,
  validarRol,
} from '../utils/auth';
import { hashPassword, comparePassword } from '../utils/hashPassword'; // Nombre corregido

// Registrar un nuevo usuario
export const registrarUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    // Hashear la contraseña antes de crear el usuario
    const contraseñaHasheada = await hashPassword(contraseña);

    const nuevoUsuario = await usuarioService.crearUsuario({
      nombre,
      correo,
      contraseña: contraseñaHasheada, // Enviar contraseña hasheada
      rol: validarRol(rol) ? rol : 'CAJERO',
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    next(error);
  }
};

// Iniciar sesión y obtener tokens
export const iniciarSesion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { correo, contraseña } = req.body;
    const usuario = await usuarioService.obtenerUsuarioPorCorreo(correo);

    if (!usuario || !(await comparePassword(contraseña, usuario.contraseña))) {
      throw new ApiError(401, 'Credenciales inválidas');
    }

    const tokens = generarParTokens({
      id: usuario.id,
      rol: usuario.rol as Role,
    });

    res.json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todos los usuarios (solo para ADMIN y GERENTE)
export const obtenerUsuarios = [
  autenticar,
  autorizar('ADMINISTRADOR', 'GERENTE'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pagina = '1', limite = '10', nombre, rol } = req.query;

      const resultado = await usuarioService.obtenerUsuarios({
        pagina: Number(pagina),
        limite: Number(limite),
        nombre: nombre?.toString(),
        rol: rol?.toString() as Role,
      });

      res.json(resultado);
    } catch (error) {
      next(error);
    }
  },
];

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const usuario = await usuarioService.obtenerUsuarioPorId(
      Number(req.params.id)
    );
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

// Obtener el usuario actualmente autenticado
export const obtenerUsuarioActual = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.usuario) throw new ApiError(401, 'No autenticado');

    const usuario = await usuarioService.obtenerUsuarioPorId(req.usuario.id);
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

// Actualizar los datos de un usuario
export const actualizarUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.usuario) throw new ApiError(401, 'No autenticado');

    const { id } = req.params;
    const datosActualizacion = req.body;

    // Validar si se está intentando cambiar el rol
    if (datosActualizacion.rol && req.usuario.rol !== 'ADMINISTRADOR') {
      throw new ApiError(403, 'No autorizado para cambiar roles');
    }

    const usuarioActualizado = await usuarioService.actualizarUsuario(
      Number(id),
      datosActualizacion,
      req.usuario
    );
    res.json(usuarioActualizado);
  } catch (error) {
    next(error);
  }
};

// Cambiar la contraseña de un usuario
export const cambiarContraseña = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.usuario) throw new ApiError(401, 'No autenticado');

    const { contraseñaActual, nuevaContraseña } = req.body;
    await usuarioService.cambiarContraseña(
      req.usuario.id,
      contraseñaActual,
      nuevaContraseña
    );
    res.json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    next(error);
  }
};

// Desactivar un usuario
export const desactivarUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.usuario) throw new ApiError(401, 'No autenticado');

    const { id } = req.params;
    await usuarioService.actualizarUsuario(
      Number(id),
      { activo: false },
      req.usuario
    );
    res.json({ mensaje: 'Usuario desactivado exitosamente' });
  } catch (error) {
    next(error);
  }
};

// Activar un usuario
export const activarUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.usuario) throw new ApiError(401, 'No autenticado');

    const { id } = req.params;
    await usuarioService.actualizarUsuario(
      Number(id),
      { activo: true },
      req.usuario
    );
    res.json({ mensaje: 'Usuario activado exitosamente' });
  } catch (error) {
    next(error);
  }
};

// Eliminar un usuario
export const eliminarUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.usuario) throw new ApiError(401, 'No autenticado');

    await usuarioService.eliminarUsuario(Number(req.params.id), req.usuario);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Buscar usuarios por un término de búsqueda
export const buscarUsuarios = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { busqueda } = req.query;
    const usuarios = await usuarioService.buscarUsuarios(
      busqueda?.toString() || ''
    );
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};
export function eliminarRolDeUsuario(
  arg0: string,
  autenticar: (req: Request, res: Response, next: NextFunction) => void,
  arg2: (req: Request, res: Response, next: NextFunction) => void,
  eliminarRolDeUsuario: any
) {
  throw new Error('Function not implemented.');
}
