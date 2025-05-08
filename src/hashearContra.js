// hash-passwords.js

import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const dbConfig = {
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_DATABASE || 'dbMedical',
    port: parseInt(process.env.DB_PORT || '3306'),
};

const main = async () => {
  const connection = await mysql.createConnection(dbConfig);

  try {
    // Paso 1: obtener los usuarios con contraseña en texto plano
    const users = await connection.query(
      "SELECT *FROM tbUsuarios WHERE id=1 AND strContra NOT LIKE '$2b$%'" // solo las que no están encriptadas
    );
    console.log('usuario',users[0]) // La consulta devuelve un array de resultados
    for (const user of users[0]) {
      const hashedPassword = await bcrypt.hash(user.strContra, 10);

      // Paso 2: actualizar la contraseña en la base de datos
      await connection.query(
        "UPDATE tbUsuarios SET strContra = ? WHERE id = ?",
        [hashedPassword, user.id]
      );

      console.log(`✅ Usuario ${user.id} actualizado.`);
    }

    console.log("🎉 Todas las contraseñas han sido encriptadas.");
  } catch (error) {
    console.error("❌ Error al encriptar contraseñas:", error);
  } finally {
    await connection.end();
  }
};

main();
