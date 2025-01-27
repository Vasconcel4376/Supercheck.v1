import {
  PrismaClient,
  Usuario,
  RolUsuario,
  RegistroAuditoria,
  Prisma,
} from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import ApiError from '../utils/apiError';
import { CargaUtilJWT } from '../utils/auth';

const prisma = new PrismaClient();

// Tipos mejorados con comentarios en español
type DatosCrearUsuario = {
  nombre: string;
  correo: string;
  contraseña: string;
  rol?: RolUsuario;
};

type DatosActualizarUsuario = Partial<DatosCrearUsuario> & {
  activo?: boolean;
};

// Función de auditoría mejorada
const crearRegistroAuditoria = async (
  usuarioId: number,
  tipoAccion: string,
  entidad: string,
  entidadId: number | null,
  detalles?: Prisma.InputJsonValue
): Promise<RegistroAuditoria> => {
  return prisma.registroAuditoria.create({
    data: {
      tipoAccion,
      entidad,
      entidadId,
      usuarioId,
      detalles: detalles ?? Prisma.DbNull, // Usar valor por defecto para JSON
    },
  });
};

export const crearUsuario = async (
  datos: DatosCrearUsuario
): Promise<Omit<Usuario, 'contraseña'>> => {
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { correo: datos.correo },
  });

  if (usuarioExistente) {
    throw new ApiError(400, 'El correo electrónico ya está registrado');
  }

  const contraseñaHasheada = await hashPassword(datos.contraseña);

  const nuevoUsuario = await prisma.usuario.create({
    data: {
      ...datos,
      contraseña: contraseñaHasheada,
      rol: datos.rol || 'CAJERO',
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
      fechaCreacion: true,
      fechaActualizacion: true,
    },
  });

  await crearRegistroAuditoria(
    nuevoUsuario.id,
    'CREACION',
    'USUARIO',
    nuevoUsuario.id,
    {
      accion: 'Creación de nuevo usuario',
      datos: nuevoUsuario,
    }
  );

  return nuevoUsuario;
};

export const obtenerUsuarioPorId = async (
  id: number
): Promise<Omit<Usuario, 'contraseña'>> => {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
      fechaCreacion: true,
      fechaActualizacion: true,
    },
  });

  if (!usuario) {
    throw new ApiError(404, 'Usuario no encontrado');
  }
  return usuario;
};

export const obtenerUsuarioPorCorreo = async (
  correo: string
): Promise<Usuario | null> => {
  return prisma.usuario.findUnique({
    where: { correo },
  });
};

export const obtenerUsuarios = async (parametros: {
  pagina: number;
  limite: number;
  nombre?: string;
  rol?: RolUsuario;
}): Promise<{ usuarios: Omit<Usuario, 'contraseña'>[]; total: number }> => {
  const { pagina, limite, nombre, rol } = parametros;
  const saltar = (pagina - 1) * limite;

  // Filtro corregido
  const condicionesBusqueda = {
    AND: [
      nombre
        ? {
            nombre: {
              contains: nombre,
              mode: 'insensitive' as const, // Solución del error
            },
          }
        : {},
      rol ? { rol } : {},
      { activo: true },
    ],
  };

  const [total, usuarios] = await Promise.all([
    prisma.usuario.count({ where: condicionesBusqueda }),
    prisma.usuario.findMany({
      where: condicionesBusqueda,
      skip: saltar,
      take: limite,
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        activo: true,
        fechaCreacion: true,
        fechaActualizacion: true,
      },
      orderBy: { fechaCreacion: 'desc' },
    }),
  ]);

  return { usuarios, total };
};

export const actualizarUsuario = async (
  id: number,
  datos: DatosActualizarUsuario,
  usuarioActual: CargaUtilJWT
): Promise<Omit<Usuario, 'contraseña'>> => {
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuarioExistente) {
    throw new ApiError(404, 'Usuario no encontrado');
  }

  if (datos.correo && datos.correo !== usuarioExistente.correo) {
    const correoExistente = await prisma.usuario.findUnique({
      where: { correo: datos.correo },
    });

    if (correoExistente) {
      throw new ApiError(400, 'El nuevo correo electrónico ya está en uso');
    }
  }

  if (datos.contraseña) {
    datos.contraseña = await hashPassword(datos.contraseña);
  }

  const usuarioActualizado = await prisma.usuario.update({
    where: { id },
    data: datos,
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
      fechaCreacion: true,
      fechaActualizacion: true,
    },
  });

  await crearRegistroAuditoria(
    usuarioActual.id,
    'ACTUALIZACION',
    'USUARIO',
    id,
    {
      accion: 'Actualización de datos de usuario',
      cambios: datos,
    }
  );

  return usuarioActualizado;
};

export const cambiarContraseña = async (
  usuarioId: number,
  contraseñaActual: string,
  nuevaContraseña: string
): Promise<void> => {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
  });

  if (!usuario) {
    throw new ApiError(404, 'Usuario no encontrado');
  }

  const contraseñaValida = await comparePassword(
    contraseñaActual,
    usuario.contraseña
  );

  if (!contraseñaValida) {
    throw new ApiError(400, 'La contraseña actual es incorrecta');
  }

  const contraseñaHasheada = await hashPassword(nuevaContraseña);

  await prisma.usuario.update({
    where: { id: usuarioId },
    data: { contraseña: contraseñaHasheada },
  });

  await crearRegistroAuditoria(
    usuarioId,
    'ACTUALIZACION',
    'USUARIO',
    usuarioId,
    {
      accion: 'Cambio de contraseña exitoso',
    }
  );
};

export const eliminarUsuario = async (
  id: number,
  usuarioActual: CargaUtilJWT
): Promise<void> => {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    throw new ApiError(404, 'Usuario no encontrado');
  }

  const tieneRelaciones = await prisma.venta.findFirst({
    where: { usuarioId: id },
  });

  if (tieneRelaciones) {
    await prisma.usuario.update({
      where: { id },
      data: { activo: false },
    });
  } else {
    await prisma.usuario.delete({
      where: { id },
    });
  }

  await crearRegistroAuditoria(usuarioActual.id, 'ELIMINACION', 'USUARIO', id, {
    accion: tieneRelaciones
      ? 'Desactivación de usuario'
      : 'Eliminación permanente de usuario',
  });
};

export const buscarUsuarios = async (
  busqueda: string
): Promise<Omit<Usuario, 'contraseña'>[]> => {
  return prisma.usuario.findMany({
    where: {
      OR: [
        {
          nombre: {
            contains: busqueda.toLowerCase(), // Convertir a minúsculas
          },
        },
        {
          correo: {
            contains: busqueda.toLowerCase(), // Convertir a minúsculas
          },
        },
      ],
      activo: true,
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
      fechaCreacion: true,
      fechaActualizacion: true,
    },
    take: 10,
  });
};
