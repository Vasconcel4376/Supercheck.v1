import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // Si no hay token, redirigir a /login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      rol: string;
    };
    // Opcional: si quieres pasar datos en las cabeceras
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('user-id', decoded.userId.toString());
    requestHeaders.set('user-rol', decoded.rol);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Error de autenticación:', error);
    const response = NextResponse.redirect(new URL('/login', req.url));
    // Eliminar la cookie
    response.cookies.delete('token');
    return response;
  }
}

// Solo protegemos todo lo que empiece con /dashboard
export const config = {
  matcher: ['/dashboard/:path*'],
};
