# 🚀 INICIO RÁPIDO - EXPEDIENTE CLÍNICO ELECTRÓNICO

## ⚡ 3 PASOS PARA EMPEZAR

### **1️⃣ EJECUTAR SQL (5 minutos)**

```bash
# Opción A: Desde terminal
mysql -u root -p esymbel_medical < FASE1_EXPEDIENTE_CLINICO.sql
mysql -u root -p esymbel_medical < FASE2_DIAGNOSTICOS_CIE10.sql
mysql -u root -p esymbel_medical < DATOS_PRUEBA_PACIENTE_EJEMPLO.sql

# Opción B: MySQL Workbench
# File → Open SQL Script → Ejecutar los 3 archivos en orden
```

---

### **2️⃣ REINICIAR SERVIDOR (30 segundos)**

```bash
# Detener servidor: Ctrl+C
# Iniciar servidor:
pnpm run dev
```

---

### **3️⃣ PROBAR (2 minutos)**

#### **A) Ver Expediente del Paciente de Ejemplo:**
```
http://localhost:3000/pacientes
```
👉 Click en botón **📂 "Ver Expediente"** de "Juan Carlos Pérez López"

#### **B) Buscar Diagnósticos CIE-10:**
```
http://localhost:3000/diagnosticos
```
👉 Buscar: **"diabetes"**, **"hipertensión"**, **"resfriado"**

---

## 📍 URLs PRINCIPALES

| Funcionalidad | URL |
|--------------|-----|
| 📋 Lista de Pacientes | `/pacientes` |
| 📁 Expediente de Paciente | `/expediente/[ID]` |
| 🩺 Diagnósticos CIE-10 | `/diagnosticos` |
| 📊 Dashboard | `/dashboard` |

---

## 🎯 LO QUE FUNCIONA AHORA

✅ **Expediente Clínico Completo** con 7 tabs:
   - Datos Generales
   - Historia Clínica (con antecedentes)
   - Consultas (timeline)
   - Estudios (laboratorio/imágenes)
   - Recetas
   - Archivos
   - Evolución (gráficas de signos vitales)

✅ **Diagnósticos CIE-10:**
   - Buscador con 40+ códigos
   - Asignación a consultas
   - 5 tipos de diagnóstico

✅ **Mejoras UI:**
   - Botón "Ver Expediente" en lista de pacientes
   - Sidebar actualizado
   - Diseño moderno y responsivo

---

## 📦 DATOS DE PRUEBA INCLUIDOS

**Paciente:** Juan Carlos Pérez López
- 🆔 CURP: PELJ850515HDFRRN09
- 🩸 Tipo Sangre: O+
- ⚠️ Alergias: Penicilina, Polen
- 🏥 Condiciones: Diabetes Tipo 2, Hipertensión

**Incluye:**
- ✅ Historia clínica completa
- ✅ 3 consultas con diagnósticos
- ✅ Signos vitales (evolución)
- ✅ 2 estudios de laboratorio
- ✅ 1 receta con medicamentos
- ✅ Archivos adjuntos

---

## 🐛 ¿PROBLEMAS?

### Error: "Table doesn't exist"
```bash
# Ejecutar scripts SQL en orden
```

### No aparece el botón "Ver Expediente"
```bash
# Reiniciar servidor
pnpm run dev
```

### No carga datos
```bash
# Verificar que scripts SQL se ejecutaron
# Revisar consola del navegador (F12)
```

---

## 📚 DOCUMENTACIÓN COMPLETA

- 📖 [RESUMEN_IMPLEMENTACION_COMPLETA.md](RESUMEN_IMPLEMENTACION_COMPLETA.md)
- 📖 [GUIA_IMPLEMENTACION_FASE1.md](GUIA_IMPLEMENTACION_FASE1.md)
- 📖 [GUIA_IMPLEMENTACION_FASE2.md](GUIA_IMPLEMENTACION_FASE2.md)

---

## ✅ CHECKLIST RÁPIDO

- [ ] ✅ SQL ejecutado
- [ ] ✅ Servidor reiniciado
- [ ] ✅ `/pacientes` funciona
- [ ] ✅ Botón "Ver Expediente" visible
- [ ] ✅ Expediente abre correctamente
- [ ] ✅ `/diagnosticos` funciona
- [ ] ✅ No hay errores en consola

---

**¡Listo para usar!** 🎉

Tu sistema médico es ahora un **Expediente Clínico Electrónico profesional**.
