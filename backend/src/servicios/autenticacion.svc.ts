import jwt from 'jsonwebtoken';
import { prisma } from '../utils/baseDatos';
import bcrypt from 'bcryptjs';

export const servicioAuth = {
  async registrarUsuario(datos: {
    nombre: string;
    correo: string;
    contraseña: string;
  }) {
    const hash = await bcrypt.hash(datos.contraseña, 10);
    return prisma.usuario.create({
      data: {
        nombre: datos.nombre,
        correo: datos.correo,
        contraseña: hash,
      },
    });
  },

  async iniciarSesion(correo: string, contraseña: string) {
    const usuario = await prisma.usuario.findUnique({ where: { correo } });
    if (!usuario || !(await bcrypt.compare(contraseña, usuario.contraseña))) {
      throw new Error('Credenciales inválidas');
    }

    return {
      token: jwt.sign({ usuarioId: usuario.id }, process.env.JWT_SECRET!, {
        expiresIn: '8h',
      }),
      usuario,
    };
  },
};
