import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // Borrar la cookie 'token'
  res.setHeader(
    'Set-Cookie',
    `token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`
  );
  return res.status(200).json({ message: 'Logout exitoso' });
}
