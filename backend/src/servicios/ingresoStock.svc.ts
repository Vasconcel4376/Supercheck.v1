import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ingresoStockService = {
  // Crear un nuevo ingreso de stock
  async crearIngreso(
    proveedorId: number,
    productoId: number,
    cantidad: number,
    costoUnitario: number
  ) {
    const costoTotal = cantidad * costoUnitario;

    return await prisma.ingresoStock.create({
      data: {
        proveedorId,
        productoId,
        cantidad,
        costoUnitario,
        costoTotal,
      },
    });
  },

  // Obtener todos los ingresos de stock
  async obtenerIngresos() {
    return await prisma.ingresoStock.findMany({
      include: {
        proveedor: true, // Incluye los detalles del proveedor
        producto: true, // Incluye los detalles del producto
      },
    });
  },
};
