# Stored Procedures - Sistema de Registro de Doctores

Este documento contiene los stored procedures necesarios para el funcionamiento completo del sistema de registro de doctores en 4 pasos.

---

## 1. sp_tbDoctores_Save
**Descripción:** Guarda los datos personales del doctor (Paso 1)  
**Retorna:** `intDoctor` (ID del doctor creado)

```sql
DELIMITER $$

CREATE PROCEDURE `sp_tbDoctores_Save`(
    IN p_strNombre VARCHAR(100),
    IN p_strApellidos VARCHAR(100),
    IN p_datFechaNacimiento DATE,
    IN p_strSexo VARCHAR(10),
    IN p_strEstado VARCHAR(100),
    IN p_strCiudad VARCHAR(100),
    IN p_strDireccion VARCHAR(255),
    IN p_strTelefono VARCHAR(20),
    IN p_strEmail VARCHAR(100)
)
BEGIN
    INSERT INTO tbdoctores (
        strNombre,
        strApellidos,
        datFechaNacimiento,
        strSexo,
        strEstado,
        strCiudad,
        strDireccion,
        strTelefono,
        strEmail,
        datFechaRegistro
    ) VALUES (
        p_strNombre,
        p_strApellidos,
        p_datFechaNacimiento,
        p_strSexo,
        p_strEstado,
        p_strCiudad,
        p_strDireccion,
        p_strTelefono,
        p_strEmail,
        NOW()
    );
    
    SELECT LAST_INSERT_ID() AS intDoctor;
END$$

DELIMITER ;
```

---

## 2. sp_tbDoctores_Datos_Profesionales_Save
**Descripción:** Guarda los datos profesionales del doctor (Paso 2)  
**Requiere:** `intDoctor` del paso anterior

```sql
DELIMITER $$

CREATE PROCEDURE `sp_tbDoctores_Datos_Profesionales_Save`(
    IN p_intDoctor INT,
    IN p_idEspecialidad INT,
    IN p_strCedulaProfesional VARCHAR(50),
    IN p_strCurpRFC VARCHAR(50),
    IN p_dblPrecioConsulta DECIMAL(10,2),
    IN p_strConsultorio VARCHAR(255),
    IN p_strDescripcionDoctor TEXT
)
BEGIN
    UPDATE tbdoctores 
    SET 
        idEspecialidad = p_idEspecialidad,
        strCedulaProfesional = p_strCedulaProfesional,
        strCurpRFC = p_strCurpRFC,
        dblPrecioConsulta = p_dblPrecioConsulta,
        strConsultorio = p_strConsultorio,
        strDescripcionDoctor = p_strDescripcionDoctor
    WHERE 
        intDoctor = p_intDoctor;
    
    SELECT ROW_COUNT() AS affected_rows;
END$$

DELIMITER ;
```

---

## 3. sp_tbDoctores_Horarios_Save
**Descripción:** Guarda los horarios de atención del doctor (Paso 3)  
**Requiere:** `intDoctor` del paso 1  
**Nota:** Inserta en la tabla independiente `tbdoctores_horarios`

```sql
DELIMITER $$

CREATE PROCEDURE `sp_tbDoctores_Horarios_Save`(
    IN p_intDoctor INT,
    IN p_horarioInicio TIME,
    IN p_horarioFin TIME,
    IN p_diasDisponibles VARCHAR(255)
)
BEGIN
    -- Eliminar horarios anteriores si existen
    DELETE FROM tbdoctores_horarios 
    WHERE intDoctor = p_intDoctor;
    
    -- Insertar nuevo horario
    INSERT INTO tbdoctores_horarios (
        intDoctor,
        horarioInicio,
        horarioFin,
        diasDisponibles,
        datFechaCreacion
    ) VALUES (
        p_intDoctor,
        p_horarioInicio,
        p_horarioFin,
        p_diasDisponibles,
        NOW()
    );
    
    SELECT LAST_INSERT_ID() AS intHorario;
END$$

DELIMITER ;
```

**Nota:** `diasDisponibles` debe ser una cadena separada por comas, ejemplo: `"Lunes,Martes,Miércoles,Jueves,Viernes"`

---

## 4. sp_tbDoctores_Usuario_Save
**Descripción:** Crea la cuenta de usuario del doctor en el sistema (Paso 4)  
**Requiere:** `intDoctor` del paso 1, contraseña ya hasheada con bcrypt

```sql
DELIMITER $$

CREATE PROCEDURE `sp_tbDoctores_Usuario_Save`(
    IN p_intDoctor INT,
    IN p_strUsuario VARCHAR(100),
    IN p_strPassword VARCHAR(255),
    IN p_strRol VARCHAR(50),
    IN p_strEstadoUsuario VARCHAR(20)
)
BEGIN
    -- Actualizar los datos de usuario en la tabla tbdoctores
    UPDATE tbdoctores 
    SET 
        strUsuario = p_strUsuario,
        strPassword = p_strPassword,
        strRol = p_strRol,
        strEstadoUsuario = p_strEstadoUsuario
    WHERE 
        intDoctor = p_intDoctor;
    
    -- Opcionalmente, también insertar en tabla de usuarios si existe
    -- INSERT INTO tbusuarios (intDoctor, strUsuario, strPassword, strRol, strEstado)
    -- VALUES (p_intDoctor, p_strUsuario, p_strPassword, p_strRol, p_strEstadoUsuario);
    
    SELECT ROW_COUNT() AS affected_rows;
END$$

DELIMITER ;
```

**Importante:** La contraseña **NO** debe enviarse en texto plano. El endpoint de la API usa bcryptjs para hashearla antes de llamar este SP.

---

## Estructura de las Tablas

### Tabla tbdoctores

Para que estos stored procedures funcionen correctamente, la tabla `tbdoctores` debe tener las siguientes columnas:

```sql
CREATE TABLE `tbdoctores` (
    `intDoctor` INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Datos Personales (Paso 1)
    `strNombre` VARCHAR(100) NOT NULL,
    `strApellidos` VARCHAR(100) NOT NULL,
    `datFechaNacimiento` DATE,
    `strSexo` VARCHAR(10),
    `strEstado` VARCHAR(100),
    `strCiudad` VARCHAR(100),
    `strDireccion` VARCHAR(255),
    `strTelefono` VARCHAR(20),
    `strEmail` VARCHAR(100) UNIQUE,
    `datFechaRegistro` DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Datos Profesionales (Paso 2)
    `idEspecialidad` INT,
    `strCedulaProfesional` VARCHAR(50),
    `strCurpRFC` VARCHAR(50),
    `dblPrecioConsulta` DECIMAL(10,2),
    `strConsultorio` VARCHAR(255),
    `strDescripcionDoctor` TEXT,
    
    -- Usuario del Sistema (Paso 4)
    `strUsuario` VARCHAR(100) UNIQUE,
    `strPassword` VARCHAR(255),
    `strRol` VARCHAR(50) DEFAULT 'Doctor',
    `strEstadoUsuario` VARCHAR(20) DEFAULT 'Activo',
    
    FOREIGN KEY (idEspecialidad) REFERENCES tbespecialidades(idEspecialidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Tabla tbdoctores_horarios (Nueva - Normalizada)

Esta tabla almacena los horarios de atención de cada doctor de forma independiente:

```sql
CREATE TABLE `tbdoctores_horarios` (
    `intHorario` INT AUTO_INCREMENT PRIMARY KEY,
    `intDoctor` INT NOT NULL,
    `horarioInicio` TIME NOT NULL,
    `horarioFin` TIME NOT NULL,
    `diasDisponibles` VARCHAR(255) NOT NULL COMMENT 'Días separados por comas: Lunes,Martes,Miércoles',
    `datFechaCreacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `datFechaModificacion` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (intDoctor) REFERENCES tbdoctores(intDoctor) ON DELETE CASCADE,
    INDEX idx_doctor (intDoctor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Ventajas de la tabla separada:**
- ✅ Mejor normalización de la base de datos
- ✅ Permite múltiples horarios por doctor en el futuro
- ✅ Facilita consultas y modificaciones de horarios
- ✅ Historial de cambios con `datFechaModificacion`

---

## Flujo de Registro

1. **POST** `/api/Doctor/guardar-doctor` → Ejecuta `sp_tbDoctores_Save` → Retorna `intDoctor`
2. **POST** `/api/Doctor/guardar-datos-profesionales` → Ejecuta `sp_tbDoctores_Datos_Profesionales_Save` con `intDoctor`
3. **POST** `/api/Doctor/guardar-horarios` → Ejecuta `sp_tbDoctores_Horarios_Save` con `intDoctor`
4. **POST** `/api/Doctor/guardar-datos-sistema` → Hashea contraseña con bcrypt → Ejecuta `sp_tbDoctores_Usuario_Save` con `intDoctor`

---

## Consultas Útiles

### Obtener horarios de un doctor

```sql
SELECT 
    d.intDoctor,
    d.strNombre,
    d.strApellidos,
    h.horarioInicio,
    h.horarioFin,
    h.diasDisponibles
FROM tbdoctores d
LEFT JOIN tbdoctores_horarios h ON d.intDoctor = h.intDoctor
WHERE d.intDoctor = ?;
```

### Obtener todos los doctores con sus horarios

```sql
SELECT 
    d.intDoctor,
    d.strNombre,
    d.strApellidos,
    d.strEmail,
    e.strNombreEspecialidad,
    h.horarioInicio,
    h.horarioFin,
    h.diasDisponibles
FROM tbdoctores d
LEFT JOIN tbespecialidades e ON d.idEspecialidad = e.idEspecialidad
LEFT JOIN tbdoctores_horarios h ON d.intDoctor = h.intDoctor
WHERE d.strEstadoUsuario = 'Activo'
ORDER BY d.strNombre;
```

---

## Verificación de Stored Procedures

Para verificar que los stored procedures existen en tu base de datos:

```sql
-- Ver todos los stored procedures
SHOW PROCEDURE STATUS WHERE Db = 'nombre_de_tu_base_de_datos';

-- Ver el código de un stored procedure específico
SHOW CREATE PROCEDURE sp_tbDoctores_Save;
SHOW CREATE PROCEDURE sp_tbDoctores_Datos_Profesionales_Save;
SHOW CREATE PROCEDURE sp_tbDoctores_Horarios_Save;
SHOW CREATE PROCEDURE sp_tbDoctores_Usuario_Save;
```

---

## Migración de Datos (Si ya tienes horarios en tbdoctores)

Si ya tienes horarios almacenados en la tabla `tbdoctores`, usa este script para migrarlos:

```sql
-- Migrar horarios existentes a la nueva tabla
INSERT INTO tbdoctores_horarios (intDoctor, horarioInicio, horarioFin, diasDisponibles)
SELECT 
    intDoctor,
    horarioInicio,
    horarioFin,
    diasDisponibles
FROM tbdoctores
WHERE horarioInicio IS NOT NULL 
  AND horarioFin IS NOT NULL 
  AND diasDisponibles IS NOT NULL;

-- Opcional: Eliminar columnas de horarios de tbdoctores después de verificar la migración
-- ALTER TABLE tbdoctores 
-- DROP COLUMN horarioInicio,
-- DROP COLUMN horarioFin,
-- DROP COLUMN diasDisponibles;
```

---

## Instalación de Dependencias

Asegúrate de tener instalado bcryptjs para el hasheo de contraseñas:

```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

---

## Notas de Seguridad

- ✅ Las contraseñas se hashean en el servidor usando bcrypt con 10 salt rounds
- ✅ Nunca enviar contraseñas en texto plano a la base de datos
- ✅ Validar que el `intDoctor` exista antes de actualizar datos en pasos 2-4
- ✅ Usar transacciones si necesitas garantizar integridad en operaciones múltiples
