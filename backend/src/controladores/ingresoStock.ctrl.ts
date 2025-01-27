import { Request, Response } from 'express';
import { ingresoStockService } from '../servicios/ingresoStock.svc';

export const ingresoStockController = {
  // Crear un nuevo ingreso de stock
  async crearIngreso(req: Request, res: Response): Promise<void> {
    try {
      const { proveedorId, productoId, cantidad, costoUnitario } = req.body;

      // Validar datos
      if (!proveedorId || !productoId || !cantidad || !costoUnitario) {
        res.status(400).json({ error: 'Faltan datos necesarios' });
        return;
      }

      // Crear el ingreso usando el servicio
      const ingreso = await ingresoStockService.crearIngreso(
        proveedorId,
        productoId,
        cantidad,
        costoUnitario
      );

      // Responder con el ingreso creado
      res.status(201).json(ingreso);
    } catch (error: unknown) {
      // Verificar si el error es una instancia de Error
      if (error instanceof Error) {
        // Si es un Error, acceder a su mensaje
        console.error(error.message);
        res.status(500).json({ error: error.message });
      } else {
        // Si el error no es una instancia de Error, se maneja como error desconocido
        console.error('Error desconocido');
        res.status(500).json({ error: 'Ocurrió un error desconocido' });
      }
    }
  },

  // Obtener todos los ingresos de stock
  async obtenerIngresos(req: Request, res: Response): Promise<void> {
    try {
      const ingresos = await ingresoStockService.obtenerIngresos();
      res.status(200).json(ingresos);
    } catch (error: unknown) {
      // Verificar si el error es una instancia de Error
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
