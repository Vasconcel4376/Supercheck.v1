import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registroAuditoriaService = {
  // Crear un nuevo registro de auditoría
  async crearRegistro(
    tipoAccion: string,
    entidad: string,
    entidadId: number | undefined,
    usuarioId: number,
    detalles?: Record<string, any>,
    direccionIP?: string,
    agenteUsuario?: string
  ) {
    return await prisma.registroAuditoria.create({
      data: {
        tipoAccion,
        entidad,
        entidadId,
        usuarioId,
        detalles,
        direccionIP,
        agenteUsuario,
      },
    });
  },

  // Obtener todos los registros de auditoría
  async obtenerRegistros() {
    return await prisma.registroAuditoria.findMany({
      include: {
        usuario: true, // Incluye los detalles del usuario relacionado
      },
    });
  },
};
