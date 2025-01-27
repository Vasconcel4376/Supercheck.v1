import { Request, Response } from 'express';
import { proveedorService } from '../servicios/proveedor.svc';

export const proveedorController = {
  // Crear un nuevo proveedor
  async crearProveedor(req: Request, res: Response): Promise<void> {
    try {
      const {
        nombre,
        contactoPrincipal,
        telefono,
        correo,
        direccion,
        calificacion,
        sitioWeb,
      } = req.body;

      // Validar los datos recibidos
      if (!nombre || !contactoPrincipal || !telefono || !correo) {
        res.status(400).json({ error: 'Faltan datos necesarios' });
        return;
      }

      // Llamar al servicio para crear el proveedor
      const proveedor = await proveedorService.crearProveedor(
        nombre,
        contactoPrincipal,
        telefono,
        correo,
        direccion,
        calificacion,
        sitioWeb
      );

      // Responder con el proveedor creado
      res.status(201).json(proveedor);
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

  // Obtener todos los proveedores
  async obtenerProveedores(req: Request, res: Response): Promise<void> {
    try {
      const proveedores = await proveedorService.obtenerProveedores();
      res.status(200).json(proveedores);
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
