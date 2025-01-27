import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // Si no hay token y está tratando de acceder a una ruta protegida
  if (!token && !req.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        rol: string;
      };
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('user-id', decoded.userId.toString());
      requestHeaders.set('user-rol', decoded.rol);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  } catch (error) {
    console.error('Error de autenticación:', error);
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('token');
    return response;
  }

  return NextResponse.next();
}
