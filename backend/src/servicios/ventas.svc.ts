import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ventaService = {
  // Crear una nueva venta
  async crearVenta(datos: {
    usuarioId: number;
    productos: Array<{ productoId: number; cantidad: number }>;
    metodoPago: string;
    detallesPago?: Record<string, any>;
  }) {
    return prisma.$transaction(async (tx) => {
      // Definir detalles de la venta
      const detallesCalculados = await Promise.all(
        datos.productos.map(async ({ productoId, cantidad }) => {
          const producto = await tx.producto.findUniqueOrThrow({
            where: { id: productoId },
            select: { precio: true, stock: true, nombre: true },
          });

          if (producto.stock < cantidad) {
            throw new Error(`Stock insuficiente para ${producto.nombre}`);
          }

          return {
            productoId,
            cantidad,
            precioUnitario: producto.precio.toNumber(),
            subtotal: producto.precio.toNumber() * cantidad, // Usamos `number` para la multiplicación
          };
        })
      );

      await Promise.all(
        detallesCalculados.map(({ productoId, cantidad }) =>
          tx.producto.update({
            where: { id: productoId },
            data: { stock: { decrement: cantidad } },
          })
        )
      );

      const subtotal = detallesCalculados.reduce(
        (sum, item) => sum + item.subtotal, // Usamos `number` en lugar de Prisma.Decimal
        0 // Usamos 0 como valor inicial
      );

      return tx.venta.create({
        data: {
          subtotal,
          total: subtotal, // Usamos `subtotal` directamente
          metodoPago: datos.metodoPago,
          detallesPago: datos.detallesPago,
          usuarioId: datos.usuarioId,
          detalles: {
            createMany: {
              data: detallesCalculados.map((d) => ({
                productoId: d.productoId,
                cantidad: d.cantidad,
                precioUnitario: d.precioUnitario,
              })),
            },
          },
        },
        include: { detalles: true },
      });
    });
  },

  // Obtener todas las ventas
  async obtenerVentas() {
    return await prisma.venta.findMany({
      include: {
        detalles: true, // Incluye los detalles de la venta
        usuario: true, // Incluye el usuario que realizó la venta
      },
    });
  },
};
