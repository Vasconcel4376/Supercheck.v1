import { Request, Response } from 'express';
import { ventaService } from '../servicios/ventas.svc';

export const ventaController = {
  // Crear una nueva venta
  async crearVenta(req: Request, res: Response): Promise<void> {
    try {
      const { usuarioId, productos, metodoPago, detallesPago } = req.body;

      // Validar los datos recibidos
      if (!usuarioId || !productos || productos.length === 0) {
        res.status(400).json({ error: 'Faltan datos necesarios' });
        return;
      }

      // Llamar al servicio para crear la venta
      const venta = await ventaService.crearVenta({
        usuarioId,
        productos,
        metodoPago,
        detallesPago,
      });

      // Responder con la venta creada
      res.status(201).json(venta);
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

  // Obtener todas las ventas
  async obtenerVentas(req: Request, res: Response): Promise<void> {
    try {
      const ventas = await ventaService.obtenerVentas();
      res.status(200).json(ventas);
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
