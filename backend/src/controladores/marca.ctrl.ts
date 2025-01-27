import { Request, Response } from 'express';
import { marcaService } from '../servicios/marca.svc';

export const marcaController = {
  // Crear una nueva marca
  async crearMarca(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, descripcion, logoUrl } = req.body;

      // Validar datos
      if (!nombre || !descripcion) {
        res.status(400).json({ error: 'Faltan datos necesarios' });
        return;
      }

      // Llamar al servicio para crear la marca
      const marca = await marcaService.crearMarca(nombre, descripcion, logoUrl);

      // Responder con la marca creada
      res.status(201).json(marca);
    } catch (error: unknown) {
      // Manejo de errores
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
      } else {
        console.error('Error desconocido');
        res.status(500).json({ error: 'Ocurrió un error desconocido' });
      }
    }
  },

  // Obtener todas las marcas
  async obtenerMarcas(req: Request, res: Response): Promise<void> {
    try {
      const marcas = await marcaService.obtenerMarcas();
      res.status(200).json(marcas);
    } catch (error: unknown) {
      // Manejo de errores
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
