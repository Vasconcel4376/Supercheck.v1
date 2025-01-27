import { Request, Response } from 'express';
import { registroAuditoriaService } from '../servicios/registroAuditoria.svc';

export const registroAuditoriaController = {
  // Crear un nuevo registro de auditoría
  async crearRegistroAuditoria(req: Request, res: Response): Promise<void> {
    try {
      const {
        tipoAccion,
        entidad,
        entidadId,
        usuarioId,
        detalles,
        direccionIP,
        agenteUsuario,
      } = req.body;

      // Validar los datos recibidos
      if (!tipoAccion || !entidad || !usuarioId) {
        res.status(400).json({ error: 'Faltan datos necesarios' });
        return;
      }

      // Llamar al servicio para crear el registro de auditoría
      const registro = await registroAuditoriaService.crearRegistro(
        tipoAccion,
        entidad,
        entidadId,
        usuarioId,
        detalles,
        direccionIP,
        agenteUsuario
      );

      // Responder con el registro de auditoría creado
      res.status(201).json(registro);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
      } else {
        console.error('Error desconocido');
        res.status(500).json({ error: 'Ocurrió un error desconocido' });
      }
    }
  },

  // Obtener todos los registros de auditoría
  async obtenerRegistrosAuditoria(req: Request, res: Response): Promise<void> {
    try {
      const registros = await registroAuditoriaService.obtenerRegistros();
      res.status(200).json(registros);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
      } else {
        console.error('Error desconocido');
        res.status(500).json({ error: 'Ocurrió un error desconocido' });
      }
    }
  },
};
