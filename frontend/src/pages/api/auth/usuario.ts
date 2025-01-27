import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Check si hay cookie 'token'
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        rol: string;
      };
      const user = await prisma.usuario.findUnique({
        where: { id: decoded.userId },
      });
      if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }
      return res.status(200).json({
        user: {
          id: user.id,
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol,
          activo: user.activo,
        },
      });
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  } else if (req.method === 'POST') {
    // Login
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan credenciales' });
    }
    try {
      const user = await prisma.usuario.findUnique({
        where: { correo: email },
      });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
      if (!bcrypt.compareSync(password, user.contraseña)) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const token = jwt.sign({ userId: user.id, rol: user.rol }, JWT_SECRET, {
        expiresIn: '8h',
      });

      res.setHeader(
        'Set-Cookie',
        `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${8 * 3600}`
      );

      return res.status(200).json({
        user: {
          id: user.id,
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol,
          activo: user.activo,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  } else {
    return res.status(405).json({ message: 'Método no permitido' });
  }
}
