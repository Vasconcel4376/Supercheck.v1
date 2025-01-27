import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const marcaService = {
  // Crear una nueva marca
  async crearMarca(nombre: string, descripcion: string, logoUrl?: string) {
    return await prisma.marca.create({
      data: {
        nombre,
        descripcion,
        logoUrl,
      },
    });
  },

  // Obtener todas las marcas
  async obtenerMarcas() {
    return await prisma.marca.findMany();
  },
};
