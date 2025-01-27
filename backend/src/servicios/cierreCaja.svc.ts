import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const cierreCajaService = {
  // Crear un nuevo cierre de caja
  async crearCierreCaja(montoInicial: number, usuarioId: number) {
    return await prisma.cierreCaja.create({
      data: {
        montoInicial,
        usuarioId,
      },
    });
  },

  // Obtener todos los cierres de caja
  async obtenerCierres() {
    return await prisma.cierreCaja.findMany({
      include: {
        usuario: true, // Incluye los detalles del usuario que realizó el cierre
      },
    });
  },

  // Cerrar una caja
  async cerrarCaja(cierreCajaId: number) {
    const cierreCaja = await prisma.cierreCaja.update({
      where: { id: cierreCajaId },
      data: {
        fechaCierre: new Date(), // Actualiza la fecha de cierre
        montoFinal: 0, // Puede ser 0 si el monto no ha sido calculado, ajusta según sea necesario
      },
    });

    return cierreCaja;
  },

  // Cerrar una caja automáticamente al finalizar el turno del cajero
  async cierreAutomatico(usuarioId: number) {
    const cierreCajaAbierto = await prisma.cierreCaja.findFirst({
      where: {
        usuarioId,
        fechaCierre: null, // Solo consideramos cierres abiertos
      },
      orderBy: {
        fechaApertura: 'desc', // Tomamos el cierre más reciente
      },
    });

    if (cierreCajaAbierto) {
      const ventasRealizadas = await prisma.venta.count({
        where: {
          cierreCajaId: cierreCajaAbierto.id,
        },
      });

      if (ventasRealizadas === 0) {
        return await prisma.cierreCaja.update({
          where: { id: cierreCajaAbierto.id },
          data: {
            fechaCierre: new Date(),
            montoFinal: cierreCajaAbierto.montoInicial,
          },
        });
      }

      const montoFinal = await this.calcularMontoFinal(cierreCajaAbierto.id);
      return await prisma.cierreCaja.update({
        where: { id: cierreCajaAbierto.id },
        data: {
          fechaCierre: new Date(),
          montoFinal: montoFinal,
        },
      });
    }

    throw new Error(
      'No se encontró un cierre de caja abierto para este usuario.'
    );
  },

  // Cierre manual de caja en caso de emergencia
  async cierreManual(usuarioId: number) {
    const cierreCajaAbierto = await prisma.cierreCaja.findFirst({
      where: {
        usuarioId,
        fechaCierre: null,
      },
      orderBy: {
        fechaApertura: 'desc',
      },
    });

    if (cierreCajaAbierto) {
      return await prisma.cierreCaja.update({
        where: { id: cierreCajaAbierto.id },
        data: {
          fechaCierre: new Date(),
          montoFinal: 0, // Asignamos un monto final de 0 si es un cierre manual
        },
      });
    }

    throw new Error(
      'No se encontró un cierre de caja abierto para este usuario.'
    );
  },

  // Calcular el monto final de un cierre de caja basado en las ventas
  async calcularMontoFinal(cierreCajaId: number) {
    const ventas = await prisma.venta.findMany({
      where: { cierreCajaId },
      include: {
        detalles: true, // Obtener detalles de venta
      },
    });

    const montoTotalVentas = ventas.reduce(
      (total, venta) => total + parseFloat(venta.total.toString()),
      0
    );

    return montoTotalVentas;
  },
};
