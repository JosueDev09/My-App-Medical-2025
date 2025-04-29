import bcrypt from "bcryptjs";
import { db } from "../db"; // tu conexión a MySQL

export async function validateUser(email: string, password: string) {
  const [user] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

  if (!user) return null;

  //const isValid = await bcrypt.compare(password, user.password);
  return// isValid ? user : null;
}
