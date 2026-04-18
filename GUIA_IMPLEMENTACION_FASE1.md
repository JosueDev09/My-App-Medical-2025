# 📋 GUÍA DE IMPLEMENTACIÓN - FASE 1: EXPEDIENTE CLÍNICO ELECTRÓNICO

## 🎯 ¿Qué se implementó?

Se ha completado exitosamente la **Fase 1** del sistema de expediente clínico electrónico, que incluye:

✅ **Script SQL** con 5 nuevas tablas  
✅ **Pantalla completa del expediente** con 7 tabs  
✅ **Formulario de Historia Clínica** completo y funcional  
✅ **Módulos de Estudios, Archivos, Recetas y Evolución**  
✅ **7 APIs REST** para todo el expediente  
✅ **Integración con el sistema existente**

---

## 🗄️ PASO 1: EJECUTAR EL SCRIPT SQL

### Instrucciones:

1. Abre tu cliente MySQL (MySQL Workbench, phpMyAdmin, DBeaver, etc.)
2. Conecta a tu base de datos: **dbmedical**
3. Ejecuta el archivo:

```
FASE1_EXPEDIENTE_CLINICO.sql
```

### ¿Qué crea este script?

#### **Tablas Nuevas:**
- `tbHistoriaClinica` - Antecedentes médicos completos del paciente
- `tbEstudios` - Estudios de laboratorio y gabinete
- `tbArchivosAdjuntos` - Archivos y documentos adjuntos
- `tbRecetas` - Recetas médicas formales
- `tbRecetaMedicamentos` - Detalle de medicamentos por receta

#### **Vistas:**
- `vw_ExpedienteCompleto` - Vista consolidada del expediente

#### **Procedimientos Almacenados:**
- `sp_ObtenerExpedienteCompleto` - Obtiene toda la información del paciente

### Verificación:

Ejecuta esta consulta para verificar que las tablas se crearon correctamente:

```sql
SHOW TABLES LIKE 'tb%';
```

Deberías ver las 5 nuevas tablas.

---

## 🔧 PASO 2: REINICIAR EL SERVIDOR DE DESARROLLO

Reinicia tu servidor Next.js para que reconozca las nuevas rutas y APIs:

```bash
# Detén el servidor (Ctrl+C si está corriendo)

# Reinicia
npm run dev
```

---

## 🚀 PASO 3: CÓMO USAR EL EXPEDIENTE

### **Acceso al Expediente:**

#### Opción 1: Desde la lista de pacientes
1. Ve a **Pacientes** en el menú lateral
2. Click en cualquier paciente
3. **Próximamente:** Habrá un botón "Ver Expediente"

#### Opción 2: Acceso directo por URL
```
http://localhost:3000/expediente/[ID_PACIENTE]
```

Ejemplo:
```
http://localhost:3000/expediente/1
```

### **Los 7 Tabs del Expediente:**

1. **📊 Datos Generales**
   - Vista de solo lectura de información demográfica
   - Datos de contacto
   - Información médica básica (tipo de sangre, alergias)

2. **📝 Historia Clínica**
   - Formulario completo de antecedentes
   - **Antecedentes Heredofamiliares** (diabetes, hipertensión, cáncer, etc.)
   - **Antecedentes Personales Patológicos** (cirugías, hospitalizaciones, alergias)
   - **Hábitos** (tabaquismo, alcoholismo, actividad física)
   - **Gineco-Obstétricos** (solo mujeres: menarca, gestas, partos, etc.)
   - Se llena **UNA VEZ** y luego se puede editar

3. **🩺 Consultas**
   - Lista cronológica de todas las consultas del paciente
   - Ver detalles de cada consulta
   - Botón para crear nueva consulta

4. **🧪 Estudios**
   - Estudios de laboratorio y gabinete
   - Solicitudes pendientes y completadas
   - Subida de archivos de resultados

5. **💊 Recetas**
   - Historial de recetas médicas emitidas
   - Folios, fechas, medicamentos
   - Descarga de PDF (próximamente)

6. **📎 Archivos**
   - Documentos adjuntos al expediente
   - Imágenes, PDFs, consentimientos
   - Organización por categorías

7. **📈 Evolución**
   - Gráficas de signos vitales en el tiempo
   - Peso, IMC, presión arterial, glucosa, temperatura
   - Promedios y tendencias

---

## 🎨 FLUJO DE TRABAJO RECOMENDADO

### **Primera vez con un paciente:**

1. **Registrar paciente** (si no existe) → `/pacientes`
2. **Abrir expediente** → `/expediente/[id]`
3. **Llenar Historia Clínica** (Tab 2) → Completar todos los antecedentes
4. **Registrar primera consulta** → Desde el tab de Consultas o Agenda

### **Consulta de seguimiento:**

1. **Abrir expediente** → `/expediente/[id]`
2. **Revisar historial** → Tab Consultas, Estudios, Evolución
3. **Nueva consulta** → Botón "Nueva Consulta"
4. **Registrar signos vitales** → Se guardan automáticamente
5. **Solicitar estudios** (si necesario) → Tab Estudios

---

## 🔌 APIS DISPONIBLES

Todas las APIs están bajo `/api/expediente/`:

### **1. Historia Clínica**
```typescript
// GET - Obtener historia clínica
GET /api/expediente/historia-clinica?intPaciente=1

// POST - Crear historia clínica
POST /api/expediente/historia-clinica
Body: { intPaciente, strDiabetes, strTabaquismo, ... }

// PUT - Actualizar historia clínica
PUT /api/expediente/historia-clinica
Body: { intPaciente, strDiabetes, strTabaquismo, ... }
```

### **2. Consultas**
```typescript
// GET - Obtener consultas de un paciente
GET /api/expediente/consultas?intPaciente=1
```

### **3. Estudios**
```typescript
// GET - Obtener estudios de un paciente
GET /api/expediente/estudios?intPaciente=1
```

### **4. Archivos**
```typescript
// GET - Obtener archivos adjuntos
GET /api/expediente/archivos?intPaciente=1
```

### **5. Recetas**
```typescript
// GET - Obtener recetas
GET /api/expediente/recetas?intPaciente=1
```

### **6. Evolución**
```typescript
// GET - Obtener evolución (signos vitales en el tiempo)
GET /api/expediente/evolucion?intPaciente=1
```

### **7. Paciente**
```typescript
// GET - Obtener información de un paciente
GET /api/pacientes/[intPaciente]
```

---

## 📱 PRÓXIMAS MEJORAS (Ya planeadas)

### **Para completar la Fase 1:**

1. **Botón "Ver Expediente"** en la lista de pacientes
2. **Subida de archivos** funcional (estudios, documentos)
3. **Visualización de PDFs** dentro del expediente
4. **Solicitud de estudios** desde el expediente

### **Fase 2 (Próximamente):**

1. **Catálogo CIE-10** de diagnósticos
2. **Recetas estructuradas** con catálogo de medicamentos
3. **Notas SOAP** (Subjetivo, Objetivo, Análisis, Plan)
4. **Consentimientos informados** digitales

---

## 🐛 TROUBLESHOOTING

### **Error: "Paciente no encontrado"**
- Verifica que el ID del paciente existe en `tbPacientes`
- Verifica que `isEliminado = 0`

### **Error: "Cannot read properties of null"**
- Asegúrate de haber ejecutado el script SQL
- Reinicia el servidor Next.js
- Limpia el caché del navegador

### **No aparece la Historia Clínica**
- Normal si es la primera vez. El botón "Editar" se activará automáticamente.
- Llena el formulario y guarda.

### **Las consultas no aparecen**
- Verifica que existan consultas en `tbConsultas` para ese paciente
- Verifica que `isEliminado = 0`

### **Error de base de datos**
- Verifica que las tablas se crearon correctamente
- Verifica las foreign keys
- Revisa los permisos del usuario de MySQL

---

## 📊 ESTRUCTURA DEL EXPEDIENTE

```
/expediente/[intPaciente]
├── Datos Generales (solo lectura)
├── Historia Clínica (editable)
│   ├── Antecedentes Heredofamiliares
│   ├── Antecedentes Patológicos
│   ├── Hábitos
│   └── Gineco-Obstétricos
├── Consultas (timeline)
├── Estudios (laboratorio/gabinete)
├── Recetas (historial)
├── Archivos (documentos)
└── Evolución (gráficas)
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Ejecuté el script SQL `FASE1_EXPEDIENTE_CLINICO.sql`
- [ ] Verifiqué que las 5 tablas se crearon
- [ ] Reinicié el servidor Next.js
- [ ] Probé abrir un expediente: `/expediente/1`
- [ ] Llené la Historia Clínica de un paciente
- [ ] Verifiqué que las consultas existentes aparecen
- [ ] Exploré los 7 tabs del expediente

---

## 🎉 ¡LISTO!

Tu sistema médico ahora tiene un **expediente clínico electrónico funcional**.

### **Lo que puedes hacer ahora:**

✅ Ver toda la información del paciente en un solo lugar  
✅ Registrar historia clínica completa  
✅ Consultar historial de consultas  
✅ Ver evolución de signos vitales  
✅ Gestionar estudios y archivos  

### **Siguiente paso:**

Una vez que pruebes esto, podemos avanzar con:
- **Fase 2:** Diagnósticos CIE-10 y recetas estructuradas
- **Mejoras de UX:** Botones de acceso rápido, búsquedas
- **Reportes:** Generación de PDFs completos del expediente

---

## 📞 SOPORTE

Si encuentras algún error o necesitas ayuda:
1. Revisa el troubleshooting
2. Verifica los logs del servidor Next.js
3. Revisa la consola del navegador (F12)

---

**Fecha de implementación:** Abril 15, 2026  
**Versión:** 1.0.0 - Fase 1  
**Stack:** Next.js 14, TypeScript, MySQL, Tailwind CSS
