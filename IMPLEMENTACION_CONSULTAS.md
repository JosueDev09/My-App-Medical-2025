# 📋 Sistema de Consultas Médicas - Implementación Completa

## 🎯 Resumen de Cambios

Se ha implementado un sistema completo de gestión de consultas médicas con las siguientes características:

### ✅ Modal con Tabs
- **Tab 1: Datos de Consulta** - Información clínica de la consulta
- **Tab 2: Signos Vitales** - Mediciones fisiológicas del paciente

### ✅ Base de Datos
Se utilizan dos tablas separadas:
- **`tbConsultas`** - Almacena información de la consulta médica
- **`tbConsultaSignosVitales`** - Almacena los signos vitales

---

## 📁 Archivos Modificados/Creados

### 1. **Frontend** - `/src/app/agenda/page.tsx`
**Cambios realizados:**
- ✅ Agregados componentes de Tabs (Shadcn UI)
- ✅ Nuevas interfaces TypeScript para `ConsultaData` y `SignosVitalesData`
- ✅ Estados separados para consulta y signos vitales
- ✅ Función de cálculo automático de IMC
- ✅ Formularios completos con todos los campos de la BD

**Campos del Tab "Datos de Consulta":**
- Motivo de Consulta
- Padecimiento Actual
- Exploración Física
- Notas de la Consulta
- Diagnóstico
- Tratamiento / Receta
- Indicaciones
- Pronóstico

**Campos del Tab "Signos Vitales":**
- Peso (kg)
- Talla (m)
- IMC (calculado automáticamente)
- Presión Arterial
- Frecuencia Cardíaca (lpm)
- Frecuencia Respiratoria (rpm)
- Temperatura (°C)
- Glucosa (mg/dL)
- Saturación de O₂ (%)

### 2. **API Backend** - `/src/app/api/consultas/route.ts`
**Nuevo endpoint creado** con los siguientes métodos:

#### POST `/api/consultas`
Guarda una consulta médica completa (consulta + signos vitales)

**Body esperado:**
```json
{
  "intPaciente": 1,
  "intDoctor": 2,
  "intCita": 5,
  "consulta": {
    "strMotivoConsulta": "Control rutinario",
    "strPadecimientoActual": "...",
    "strExploracionFisica": "...",
    "strNotasConsulta": "...",
    "strDiagnostico": "...",
    "strTratamiento": "...",
    "strIndicaciones": "...",
    "strPronostico": "..."
  },
  "signosVitales": {
    "dblPeso": "70.5",
    "dblTalla": "1.75",
    "dblIMC": "23.02",
    "strPresionArterial": "120/80",
    "intFrecuenciaCardiaca": "72",
    "intFrecuenciaRespiratoria": "18",
    "dblTemperatura": "36.5",
    "dblGlucosa": "100",
    "dblSaturacionOxigeno": "98"
  }
}
```

**Características:**
- ✅ Usa transacciones para garantizar integridad de datos
- ✅ Rollback automático en caso de error
- ✅ Validación de datos requeridos
- ✅ Conversión de tipos (string → decimal/int)
- ✅ Soporte para campos opcionales (NULL)

#### GET `/api/consultas?intPaciente=1`
Obtiene todas las consultas de un paciente

#### GET `/api/consultas?intConsulta=5`
Obtiene detalles completos de una consulta específica (incluye signos vitales)

### 3. **API Agenda** - `/src/app/api/agenda/route.ts`
**Modificaciones:**
- ✅ Agregados campos `intPaciente` e `intDoctor` en la consulta
- ✅ Agregado cálculo de edad del paciente
- ✅ Necesarios para guardar la consulta médica

### 4. **Base de Datos** - `BASE_DATOS_CONSULTAS.sql`
Script SQL completo que incluye:

✅ **Tablas:**
- `tbConsultas` - Con índices y foreign keys
- `tbConsultaSignosVitales` - Relacionada con consultas

✅ **Vistas:**
- `vw_ConsultasCompletas` - Vista con información completa

✅ **Procedimientos almacenados:**
- `sp_ObtenerHistorialConsultas` - Historial de un paciente
- `sp_ObtenerDetalleConsulta` - Detalles completos de una consulta

✅ **Triggers:**
- `trg_tbConsultas_before_update` - Actualiza fecha de modificación

✅ **Índices:**
- Índices para mejorar rendimiento de búsquedas

---

## 🚀 Pasos de Instalación

### 1️⃣ Ejecutar Script de Base de Datos

Abre tu cliente MySQL (MySQL Workbench, phpMyAdmin, DBeaver, etc.) y ejecuta:

```bash
BASE_DATOS_CONSULTAS.sql
```

Este script creará:
- Las tablas necesarias
- Los índices
- Las vistas
- Los procedimientos almacenados
- Los triggers

### 2️⃣ Verificar Tablas Creadas

Ejecuta esta consulta para verificar:

```sql
SHOW TABLES LIKE 'tbConsultas%';
```

Deberías ver:
- `tbConsultas`
- `tbConsultaSignosVitales`

### 3️⃣ Verificar la Vista

```sql
SELECT * FROM vw_ConsultasCompletas LIMIT 5;
```

### 4️⃣ Reiniciar el Servidor de Desarrollo

```bash
npm run dev
```

---

## 🎨 Uso del Sistema

### 1. **Acceder a la Agenda**
- Navega a `/agenda` en tu aplicación
- Selecciona una cita con estado "EN ESPERA"

### 2. **Iniciar Consulta**
- Click en "INICIAR CONSULTA"
- Se abre el modal con tabs

### 3. **Llenar Datos de Consulta (Tab 1)**
- Motivo de consulta (precargado de la cita)
- Padecimiento actual
- Exploración física
- Notas
- Diagnóstico
- Tratamiento
- Indicaciones
- Pronóstico

### 4. **Registrar Signos Vitales (Tab 2)**
- Peso y Talla (calcula IMC automáticamente)
- Presión arterial
- Frecuencias cardíaca y respiratoria
- Temperatura
- Glucosa
- Saturación de oxígeno

### 5. **Finalizar Consulta**
- Click en "FINALIZAR CONSULTA"
- Se guardan ambas tablas en una transacción
- La cita cambia a estado "FINALIZADA"

---

## 📊 Estructura de Base de Datos

### Tabla: `tbConsultas`
```sql
intConsulta              INT (PK, AUTO_INCREMENT)
intPaciente              INT (FK → tbPacientes)
intCita                  INT (FK → tbCitas, NULL)
intDoctor                INT (FK → tbDoctores)
datFechaConsulta         DATETIME
strMotivoConsulta        VARCHAR(255)
strPadecimientoActual    TEXT
strExploracionFisica     TEXT
strNotasConsulta         TEXT
strDiagnostico           TEXT
strTratamiento           TEXT
strIndicaciones          TEXT
strPronostico            TEXT
datProximaConsulta       DATETIME (NULL)
strEstatusConsulta       ENUM('ABIERTA','FINALIZADA','CANCELADA')
datFechaRegistro         DATETIME
datFechaActualizacion    DATETIME
isEliminado              TINYINT(1)
```

### Tabla: `tbConsultaSignosVitales`
```sql
intSignoVital               INT (PK, AUTO_INCREMENT)
intConsulta                 INT (FK → tbConsultas, CASCADE DELETE)
dblPeso                     DECIMAL(10,2)
dblTalla                    DECIMAL(10,2)
dblIMC                      DECIMAL(10,2)
strPresionArterial          VARCHAR(20)
intFrecuenciaCardiaca       INT
intFrecuenciaRespiratoria   INT
dblTemperatura              DECIMAL(10,2)
dblGlucosa                  DECIMAL(10,2)
dblSaturacionOxigeno        DECIMAL(10,2)
datFechaRegistro            DATETIME
```

---

## 🔍 Consultas Útiles

### Ver última consulta de un paciente:
```sql
SELECT * FROM vw_ConsultasCompletas 
WHERE intPaciente = 1 
ORDER BY datFechaConsulta DESC 
LIMIT 1;
```

### Obtener historial completo de un paciente:
```sql
CALL sp_ObtenerHistorialConsultas(1);
```

### Ver detalles de una consulta específica:
```sql
CALL sp_ObtenerDetalleConsulta(1);
```

### Estadísticas de consultas por doctor:
```sql
SELECT 
    strNombreCompletoDoctor,
    COUNT(*) as totalConsultas,
    SUM(CASE WHEN strEstatusConsulta = 'FINALIZADA' THEN 1 ELSE 0 END) as finalizadas
FROM vw_ConsultasCompletas
GROUP BY strNombreCompletoDoctor;
```

---

## 🎁 Características Adicionales Implementadas

### 1. **Cálculo Automático de IMC**
El IMC se calcula automáticamente cuando el usuario ingresa peso y talla:
```
IMC = peso (kg) / talla² (m²)
```

### 2. **Transacciones en la API**
Garantiza que ambas tablas se inserten correctamente o ninguna:
```typescript
await connection.beginTransaction();
// Insertar consulta
// Insertar signos vitales
await connection.commit();
// En caso de error: await connection.rollback();
```

### 3. **Validación de Datos**
- Campos requeridos validados
- Conversión de tipos automática
- Soporte para valores NULL en campos opcionales

### 4. **UX Mejorada**
- Tabs con íconos descriptivos
- Campos organizados lógicamente
- IMC calculado en tiempo real
- Feedback visual durante guardado

---

## ⚠️ Notas Importantes

1. **Foreign Keys**: Asegúrate de que las tablas `tbPacientes`, `tbDoctores`, `tbCitas` existan antes de ejecutar el script.

2. **Permisos**: El usuario de la base de datos necesita permisos para:
   - CREATE TABLE
   - CREATE VIEW
   - CREATE PROCEDURE
   - CREATE TRIGGER
   - CREATE INDEX

3. **Campos Requeridos en API**:
   - `intPaciente` (obligatorio)
   - `intDoctor` (obligatorio)
   - `strMotivoConsulta` (obligatorio en consulta)

4. **Campos Opcionales**: Todos los demás campos pueden ser NULL o cadenas vacías.

---

## 🐛 Troubleshooting

### Error: "Foreign key constraint fails"
**Solución:** Verifica que existan las tablas referenciadas:
```sql
SHOW TABLES LIKE 'tbPacientes';
SHOW TABLES LIKE 'tbDoctores';
SHOW TABLES LIKE 'tbCitas';
```

### Error: "intPaciente or intDoctor missing"
**Solución:** Verifica que el endpoint `/api/agenda` esté devolviendo estos campos. Ya fue actualizado en este cambio.

### No se calcula el IMC automáticamente
**Solución:** Verifica que los campos peso y talla sean números válidos mayores a cero.

### Error al guardar consulta
**Verificar:**
1. Que las tablas estén creadas
2. Que el endpoint `/api/consultas` esté accesible
3. Revisar la consola del navegador para más detalles
4. Revisar logs del servidor Node.js

---

## 📞 Soporte

Si encuentras algún error:
1. Verifica la consola del navegador (F12)
2. Revisa los logs del servidor Node.js
3. Verifica que las tablas estén creadas correctamente
4. Comprueba que los datos de prueba sean válidos

---

## ✅ Checklist de Implementación

- [ ] Ejecutar `BASE_DATOS_CONSULTAS.sql`
- [ ] Verificar que las tablas se crearon correctamente
- [ ] Verificar que las vistas funcionan
- [ ] Probar los procedimientos almacenados
- [ ] Reiniciar servidor Node.js (`npm run dev`)
- [ ] Probar crear una consulta desde la agenda
- [ ] Verificar que ambas tablas se llenan correctamente
- [ ] Probar el cálculo automático de IMC

---

## 🎉 ¡Listo!

Tu sistema de consultas médicas está completamente implementado y listo para usar. El modal ahora tiene tabs profesionales que separan los datos de consulta de los signos vitales, y toda la información se guarda correctamente en tablas separadas de la base de datos.
