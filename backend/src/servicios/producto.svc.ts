import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const productoService = {
  // Crear un nuevo producto
  async crearProducto(
    nombre: string,
    sku: string,
    descripcion: string | undefined,
    marcaId: number,
    precio: number,
    costo: number,
    stock: number,
    proveedorId: number | undefined
  ) {
    return await prisma.producto.create({
      data: {
        nombre,
        sku,
        descripcion,
        marcaId,
        precio,
        costo,
        stock,
        proveedorId,
      },
    });
  },

  // Obtener todos los productos
  async obtenerProductos() {
    return await prisma.producto.findMany({
      include: {
        marca: true, // Incluye los detalles de la marca
        proveedor: true, // Incluye los detalles del proveedor
      },
    });
  },
};
