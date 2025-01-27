import { Request, Response } from 'express';
import { cierreCajaService } from '../servicios/cierreCaja.svc';

export const cierreCajaController = {
  // Crear un nuevo cierre de caja
  async crearCierreCaja(req: Request, res: Response): Promise<void> {
    try {
      const { montoInicial, usuarioId } = req.body;

      // Validar los datos recibidos
      if (!montoInicial || !usuarioId) {
        res.status(400).json({ error: 'Faltan datos necesarios' });
        return;
      }

      // Llamar al servicio para crear el cierre de caja
      const cierreCaja = await cierreCajaService.crearCierreCaja(
        montoInicial,
        usuarioId
      );

      // Responder con el cierre de caja creado
      res.status(201).json(cierreCaja);
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

  // Obtener todos los cierres de caja
  async obtenerCierres(req: Request, res: Response): Promise<void> {
    try {
      const cierres = await cierreCajaService.obtenerCierres();
      res.status(200).json(cierres);
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

  // Cerrar una caja
  async cerrarCaja(req: Request, res: Response): Promise<void> {
    try {
      const { cierreCajaId } = req.params;

      if (!cierreCajaId) {
        res.status(400).json({ error: 'Faltan datos necesarios' });
        return;
      }

      const cierre = await cierreCajaService.cerrarCaja(parseInt(cierreCajaId));
      res.status(200).json(cierre);
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

  // Cierre automático de caja al final del turno
  async cierreAutomatico(req: Request, res: Response): Promise<void> {
    const { usuarioId } = req.params;

    try {
      const cierre = await cierreCajaService.cierreAutomatico(
        Number(usuarioId)
      );
      res.status(200).json(cierre);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Ocurrió un error desconocido' });
      }
    }
  },

  // Cierre manual de caja en caso de emergencia
  async cierreManual(req: Request, res: Response): Promise<void> {
    const { usuarioId } = req.params;

    try {
      const cierre = await cierreCajaService.cierreManual(Number(usuarioId));
      res.status(200).json(cierre);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Ocurrió un error desconocido' });
      }
    }
  },
};
