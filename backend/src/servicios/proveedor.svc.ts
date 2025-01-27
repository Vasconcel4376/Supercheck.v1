import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const proveedorService = {
  // Crear un nuevo proveedor
  async crearProveedor(
    nombre: string,
    contactoPrincipal: string,
    telefono: string,
    correo: string,
    direccion?: string,
    calificacion: number = 0.0,
    sitioWeb?: string
  ) {
    return await prisma.proveedor.create({
      data: {
        nombre,
        contactoPrincipal,
        telefono,
        correo,
        direccion,
        calificacion,
        sitioWeb,
      },
    });
  },

  // Obtener todos los proveedores
  async obtenerProveedores() {
    return await prisma.proveedor.findMany();
  },
};
