import { Request, Response } from 'express';
import { productoService } from '../servicios/producto.svc';

export const productoController = {
  // Crear un nuevo producto
  async crearProducto(req: Request, res: Response): Promise<void> {
    try {
      const {
        nombre,
        sku,
        descripcion,
        marcaId,
        precio,
        costo,
        stock,
        proveedorId,
      } = req.body;

      // Validar los datos recibidos
      if (!nombre || !sku || !precio || !costo || stock === undefined) {
        res.status(400).json({ error: 'Faltan datos necesarios' });
        return;
      }

      // Llamar al servicio para crear el producto
      const producto = await productoService.crearProducto(
        nombre,
        sku,
        descripcion,
        marcaId,
        precio,
        costo,
        stock,
        proveedorId
      );

      // Responder con el producto creado
      res.status(201).json(producto);
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

  // Obtener todos los productos
  async obtenerProductos(req: Request, res: Response): Promise<void> {
    try {
      const productos = await productoService.obtenerProductos();
      res.status(200).json(productos);
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
