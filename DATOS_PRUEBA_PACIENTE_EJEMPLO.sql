-- =============================================
-- DATOS DE PRUEBA: PACIENTE DE EJEMPLO
-- Script para probar el Expediente Clínico Electrónico
-- =============================================

-- Este script inserta datos de ejemplo para probar todas las funcionalidades
-- del expediente clínico electrónico

-- =============================================
-- 1. VERIFICAR/INSERTAR DOCTOR DE EJEMPLO
-- =============================================

INSERT INTO tbDoctores (strNombre, strApellidos, intEspecialidad, strCedula, strTelefono, strEmail, strEstatus)
VALUES 
  ('María Elena', 'González Ramírez', 1, 'CED-12345678', '5551234567', 'dra.gonzalez@esymbel.com', 'ACTIVO')
ON DUPLICATE KEY UPDATE intDoctor = LAST_INSERT_ID(intDoctor);

SET @intDoctorPrueba = LAST_INSERT_ID();

-- =============================================
-- 2. INSERTAR PACIENTE DE EJEMPLO
-- =============================================

INSERT INTO tbPacientes (
  strNombre, 
  strApellidoPaterno, 
  strApellidoMaterno, 
  datFechaNacimiento, 
  strGenero, 
  strTelefono, 
  strTelefonoEmergencia,
  strEmail, 
  strDireccion, 
  strCiudad, 
  strEstado, 
  strCodigoPostal,
  strCurp,
  strTipoSangre,
  strAlergias,
  strEnfermedadesCronicas,
  strMedicamentosActuales,
  strEstatus
) VALUES (
  'Juan Carlos',
  'Pérez',
  'López',
  '1985-05-15',
  'Masculino',
  '5559876543',
  '5551112233',
  'juan.perez@email.com',
  'Av. Reforma 123, Col. Centro',
  'Ciudad de México',
  'CDMX',
  '06000',
  'PELJ850515HDFRRN09',
  'O+',
  'Penicilina, Polen',
  'Diabetes Mellitus Tipo 2, Hipertensión Arterial',
  'Metformina 850mg c/12hrs, Losartán 50mg c/24hrs',
  'ACTIVO'
);

SET @intPacientePrueba = LAST_INSERT_ID();

SELECT CONCAT('✅ Paciente creado con ID: ', @intPacientePrueba) AS Mensaje;

-- =============================================
-- 3. HISTORIA CLÍNICA DEL PACIENTE
-- =============================================

INSERT INTO tbHistoriaClinica (
  intPaciente,
  -- Antecedentes Heredo-Familiares
  strDiabetes,
  strHipertension,
  strCancer,
  strCardiopatias,
  strEnfermedadesRenales,
  strEnfermedadesNeurologicas,
  strOtrosHeredo,
  
  -- Antecedentes Patológicos
  strEnfermedadesInfancia,
  strCirugiasprevias,
  strHospitalizaciones,
  strTransfusiones,
  strFracturas,
  strOtrosPatologicos,
  
  -- Hábitos
  strTabaquismo,
  strAlcoholismo,
  strDrogas,
  strEjercicio,
  strAlimentacion,
  
  -- Gineco-Obstétricos (solo para mujeres, NULL para este paciente masculino)
  intMenarca,
  intGestas,
  intPartos,
  intCesareas,
  intAbortos,
  datFechaUltimaMenstruacion,
  
  txtNotasAdicionales
) VALUES (
  @intPacientePrueba,
  -- Heredo-Familiares
  'Padre con diabetes tipo 2 diagnosticado a los 55 años',
  'Madre hipertensa desde los 60 años',
  'Abuela materna con cáncer de mama',
  'Tío paterno con infarto agudo al miocardio',
  'Negados',
  'Negados',
  'Familiares con obesidad',
  
  -- Patológicos
  'Varicela a los 7 años, sarampión a los 5 años',
  'Apendicectomía a los 20 años',
  'Hospitalización por neumonía a los 15 años',
  'Negadas',
  'Fractura de radio derecho a los 30 años',
  'Amigdalitis recurrente en la infancia',
  
  -- Hábitos
  'Exfumador (dejó hace 5 años, 10 años fumando 10 cigarrillos/día)',
  'Consumo social ocasional (2-3 veces al mes)',
  'Negado',
  'Caminata 3 veces por semana, 30 minutos',
  'Dieta regular, consume 3 comidas al día, poca ingesta de verduras',
  
  -- Gineco-Obstétricos
  NULL, NULL, NULL, NULL, NULL, NULL,
  
  'Paciente diagnosticado con DM2 hace 3 años. Buen apego al tratamiento. Control glucémico aceptable.'
);

SELECT '✅ Historia clínica creada' AS Mensaje;

-- =============================================
-- 4. CONSULTAS DEL PACIENTE (3 consultas)
-- =============================================

-- Consulta 1: Consulta inicial (hace 3 meses)
INSERT INTO tbConsultas (
  intPaciente,
  intDoctor,
  datFechaConsulta,
  strMotivoConsulta,
  txtExploracionFisica,
  txtPlanTratamiento,
  txtObservaciones
) VALUES (
  @intPacientePrueba,
  @intDoctorPrueba,
  DATE_SUB(NOW(), INTERVAL 3 MONTH),
  'Revisión de control de diabetes e hipertensión',
  'Paciente consciente, orientado. Peso: 82kg, Talla: 170cm, IMC: 28.3. Signos vitales estables.',
  'Continuar con Metformina 850mg c/12hrs y Losartán 50mg c/24hrs. Dieta baja en carbohidratos. Ejercicio regular.',
  'Paciente refiere buen apego a tratamiento. Glucosa capilar en ayunas: 110 mg/dL'
);

SET @intConsulta1 = LAST_INSERT_ID();

-- Signos vitales consulta 1
INSERT INTO tbConsultaSignosVitales (
  intConsulta,
  decPresionArterialSistolica,
  decPresionArterialDiastolica,
  decFrecuenciaCardiaca,
  decFrecuenciaRespiratoria,
  decTemperatura,
  decPeso,
  decTalla,
  decIMC,
  decGlucosa,
  decSaturacionOxigeno
) VALUES (
  @intConsulta1,
  130.0, 85.0, 78.0, 18.0, 36.5, 82.0, 1.70, 28.3, 110.0, 97.0
);

-- Diagnósticos consulta 1
INSERT INTO tbConsultaDiagnosticos (intConsulta, intCIE10, strTipoDiagnostico, txtNotasDiagnostico)
VALUES 
  (@intConsulta1, (SELECT intCIE10 FROM tbCatalogoCIE10 WHERE strCodigo = 'E11' LIMIT 1), 'PRINCIPAL', 'Diabetes tipo 2 en control'),
  (@intConsulta1, (SELECT intCIE10 FROM tbCatalogoCIE10 WHERE strCodigo = 'I10' LIMIT 1), 'SECUNDARIO', 'Hipertensión arterial controlada');

-- =============================================

-- Consulta 2: Seguimiento (hace 1 mes)
INSERT INTO tbConsultas (
  intPaciente,
  intDoctor,
  datFechaConsulta,
  strMotivoConsulta,
  txtExploracionFisica,
  txtPlanTratamiento,
  txtObservaciones
) VALUES (
  @intPacientePrueba,
  @intDoctorPrueba,
  DATE_SUB(NOW(), INTERVAL 1 MONTH),
  'Seguimiento de control metabólico',
  'Paciente en mejores condiciones. Peso: 80kg (perdió 2kg). Signos vitales dentro de parámetros normales.',
  'Continuar tratamiento actual. Felicitar por pérdida de peso. Laboratorios de control en 2 meses.',
  'Paciente refiere mejor adherencia a dieta. Glucosa capilar: 105 mg/dL'
);

SET @intConsulta2 = LAST_INSERT_ID();

-- Signos vitales consulta 2
INSERT INTO tbConsultaSignosVitales (
  intConsulta,
  decPresionArterialSistolica,
  decPresionArterialDiastolica,
  decFrecuenciaCardiaca,
  decFrecuenciaRespiratoria,
  decTemperatura,
  decPeso,
  decTalla,
  decIMC,
  decGlucosa,
  decSaturacionOxigeno
) VALUES (
  @intConsulta2,
  125.0, 80.0, 75.0, 17.0, 36.4, 80.0, 1.70, 27.7, 105.0, 98.0
);

-- Diagnósticos consulta 2
INSERT INTO tbConsultaDiagnosticos (intConsulta, intCIE10, strTipoDiagnostico, txtNotasDiagnostico)
VALUES 
  (@intConsulta2, (SELECT intCIE10 FROM tbCatalogoCIE10 WHERE strCodigo = 'E11' LIMIT 1), 'PRINCIPAL', 'Mejoría en control glucémico'),
  (@intConsulta2, (SELECT intCIE10 FROM tbCatalogoCIE10 WHERE strCodigo = 'I10' LIMIT 1), 'SECUNDARIO', 'Presión arterial en meta');

-- =============================================

-- Consulta 3: Consulta por síntoma agudo (hace 1 semana)
INSERT INTO tbConsultas (
  intPaciente,
  intDoctor,
  datFechaConsulta,
  strMotivoConsulta,
  txtExploracionFisica,
  txtPlanTratamiento,
  txtObservaciones
) VALUES (
  @intPacientePrueba,
  @intDoctorPrueba,
  DATE_SUB(NOW(), INTERVAL 1 WEEK),
  'Cefalea intensa y tos seca desde hace 3 días',
  'Paciente con facies de dolor. Faringe hiperémica. Temperatura: 37.8°C. Campos pulmonares limpios.',
  'Paracetamol 500mg c/8hrs PRN para cefalea y fiebre. Loratadina 10mg c/24hrs. Abundantes líquidos. Reposo.',
  'Cuadro compatible con infección viral de vías respiratorias superiores. Indicaciones de alarma explicadas.'
);

SET @intConsulta3 = LAST_INSERT_ID();

-- Signos vitales consulta 3
INSERT INTO tbConsultaSignosVitales (
  intConsulta,
  decPresionArterialSistolica,
  decPresionArterialDiastolica,
  decFrecuenciaCardiaca,
  decFrecuenciaRespiratoria,
  decTemperatura,
  decPeso,
  decTalla,
  decIMC,
  decGlucosa,
  decSaturacionOxigeno
) VALUES (
  @intConsulta3,
  135.0, 88.0, 82.0, 20.0, 37.8, 80.0, 1.70, 27.7, 115.0, 96.0
);

-- Diagnósticos consulta 3
INSERT INTO tbConsultaDiagnosticos (intConsulta, intCIE10, strTipoDiagnostico, txtNotasDiagnostico)
VALUES 
  (@intConsulta3, (SELECT intCIE10 FROM tbCatalogoCIE10 WHERE strCodigo = 'J06.9' LIMIT 1), 'PRINCIPAL', 'Infección viral aguda'),
  (@intConsulta3, (SELECT intCIE10 FROM tbCatalogoCIE10 WHERE strCodigo = 'R51' LIMIT 1), 'SECUNDARIO', 'Cefalea asociada a cuadro viral'),
  (@intConsulta3, (SELECT intCIE10 FROM tbCatalogoCIE10 WHERE strCodigo = 'R05' LIMIT 1), 'SECUNDARIO', 'Tos seca');

SELECT '✅ 3 consultas creadas con signos vitales y diagnósticos' AS Mensaje;

-- =============================================
-- 5. ESTUDIOS DE LABORATORIO
-- =============================================

INSERT INTO tbEstudios (
  intPaciente,
  intConsulta,
  strTipoEstudio,
  strNombreEstudio,
  datFechaSolicitud,
  datFechaResultado,
  strEstatus,
  txtResultados,
  txtInterpretacion
) VALUES 
(
  @intPacientePrueba,
  @intConsulta1,
  'LABORATORIO',
  'Química Sanguínea Completa',
  DATE_SUB(NOW(), INTERVAL 3 MONTH),
  DATE_SUB(NOW(), INTERVAL 85 DAY),
  'COMPLETADO',
  'Glucosa: 112 mg/dL, Creatinina: 0.9 mg/dL, BUN: 15 mg/dL, Colesterol total: 195 mg/dL, HDL: 45 mg/dL, LDL: 120 mg/dL, Triglicéridos: 150 mg/dL',
  'Valores dentro de parámetros aceptables. Perfil lipídico levemente elevado.'
),
(
  @intPacientePrueba,
  @intConsulta1,
  'LABORATORIO',
  'Hemoglobina Glucosilada (HbA1c)',
  DATE_SUB(NOW(), INTERVAL 3 MONTH),
  DATE_SUB(NOW(), INTERVAL 85 DAY),
  'COMPLETADO',
  'HbA1c: 6.8%',
  'Control glucémico aceptable (meta <7%)'
);

SELECT '✅ Estudios de laboratorio creados' AS Mensaje;

-- =============================================
-- 6. ARCHIVOS ADJUNTOS (SIMULADOS)
-- =============================================

INSERT INTO tbArchivosAdjuntos (
  intPaciente,
  intConsulta,
  strNombreArchivo,
  strTipoArchivo,
  strRutaArchivo,
  strCategoria,
  decTamanoKB,
  txtDescripcion
) VALUES 
(
  @intPacientePrueba,
  @intConsulta1,
  'laboratorio_quimica_sanguinea.pdf',
  'application/pdf',
  '/uploads/pacientes/' || @intPacientePrueba || '/laboratorio_quimica_sanguinea.pdf',
  'ESTUDIO',
  245.5,
  'Resultados de química sanguínea completa'
),
(
  @intPacientePrueba,
  @intConsulta1,
  'HbA1c_resultado.pdf',
  'application/pdf',
  '/uploads/pacientes/' || @intPacientePrueba || '/HbA1c_resultado.pdf',
  'ESTUDIO',
  128.3,
  'Resultado de Hemoglobina Glucosilada'
),
(
  @intPacientePrueba,
  NULL,
  'consentimiento_informado.pdf',
  'application/pdf',
  '/uploads/pacientes/' || @intPacientePrueba || '/consentimiento_informado.pdf',
  'CONSENTIMIENTO',
  89.7,
  'Consentimiento informado firmado para tratamiento'
);

SELECT '✅ Archivos adjuntos simulados creados' AS Mensaje;

-- =============================================
-- 7. RECETA MÉDICA
-- =============================================

INSERT INTO tbRecetas (
  intPaciente,
  intConsulta,
  intDoctor,
  datFechaEmision,
  strFolio,
  txtIndicaciones,
  intDiasTratamiento,
  strEstatus
) VALUES (
  @intPacientePrueba,
  @intConsulta3,
  @intDoctorPrueba,
  DATE_SUB(NOW(), INTERVAL 1 WEEK),
  CONCAT('RX-', YEAR(NOW()), '-', LPAD(@intPacientePrueba, 6, '0')),
  'Tomar medicamentos según indicación. Abundantes líquidos. Reposo. Regresar si presenta datos de alarma.',
  7,
  'ACTIVA'
);

SET @intReceta = LAST_INSERT_ID();

INSERT INTO tbRecetaMedicamentos (
  intReceta,
  strMedicamento,
  strPresentacion,
  strDosis,
  strViaAdministracion,
  strFrecuencia,
  intDuracionDias
) VALUES 
(
  @intReceta,
  'Paracetamol',
  'Tabletas 500mg',
  '1 tableta',
  'Oral',
  'Cada 8 horas si hay dolor o fiebre',
  7
),
(
  @intReceta,
  'Loratadina',
  'Tabletas 10mg',
  '1 tableta',
  'Oral',
  'Cada 24 horas',
  7
);

SELECT '✅ Receta médica con medicamentos creada' AS Mensaje;

-- =============================================
-- RESUMEN FINAL
-- =============================================

SELECT '========================================' AS '';
SELECT '✅ DATOS DE PRUEBA CREADOS EXITOSAMENTE' AS '';
SELECT '========================================' AS '';
SELECT CONCAT('ID del Paciente: ', @intPacientePrueba) AS 'Información';
SELECT CONCAT('Nombre: Juan Carlos Pérez López') AS '';
SELECT CONCAT('URL del Expediente: http://localhost:3000/expediente/', @intPacientePrueba) AS '';
SELECT '========================================' AS '';

SELECT CONCAT(
  'Datos creados:\n',
  '- 1 Paciente\n',
  '- 1 Historia Clínica Completa\n',
  '- 3 Consultas\n',
  '- 3 Registros de Signos Vitales\n',
  '- 7 Diagnósticos CIE-10\n',
  '- 2 Estudios de Laboratorio\n',
  '- 3 Archivos Adjuntos\n',
  '- 1 Receta con 2 Medicamentos'
) AS 'Resumen';

SELECT '========================================' AS '';
SELECT '🚀 Ahora puedes probar el expediente completo en:' AS '';
SELECT CONCAT('   http://localhost:3000/expediente/', @intPacientePrueba) AS '';
SELECT '========================================' AS '';
