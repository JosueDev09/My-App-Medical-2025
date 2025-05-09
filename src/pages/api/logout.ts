
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", [
    "token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict",
    "token=; Path=/dashboard; HttpOnly; Max-Age=0; SameSite=Strict", // 🔥 fuerza limpieza
    "role=; Path=/; Max-Age=0; SameSite=Strict",
  ]);
  res.status(200).json({ success: true });
 
}