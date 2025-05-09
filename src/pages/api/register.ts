import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 
 try {
    if (req.method !== 'POST') return res.status(405).end();

  const { strUsuario, strNombre, strCorreo, strTelefono, strContra } = req.body;

  // Validar usuario (SP o lógica personalizada)
  const [spRows]: any = await db.query("CALL sp_ValidarLoginUsuario (?)", [strUsuario]);
  const user = spRows[0]?.[0];

  if (user) {
    return res.status(409).json({ error: 'El usuario ya existe' });
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(strContra, 10);

  // Guardar el nuevo usuario en la base de datos
  await db.query("CALL sp_InsertarUsuario (?, ?, ?, ?, ?)", [strUsuario, strNombre, strCorreo, strTelefono, hashedPassword]);

  return res.status(201).json({ success: true });
}   catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ error: 'Error inesperado al registrar usuario.' });
  }
  
}