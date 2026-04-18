-- =============================================
-- FASE 1: EXPEDIENTE CLÍNICO ELECTRÓNICO
-- Script de Base de Datos
-- Fecha: Abril 2026
-- =============================================

-- =============================================
-- TABLA: tbHistoriaClinica
-- Descripción: Antecedentes médicos completos del paciente (se llena UNA VEZ)
-- =============================================

CREATE TABLE IF NOT EXISTS tbHistoriaClinica (
    intHistoriaClinica INT NOT NULL AUTO_INCREMENT,
    intPaciente INT NOT NULL,
    
    -- ============================================
    -- ANTECEDENTES HEREDOFAMILIARES
    -- ============================================
    strDiabetes ENUM('SI','NO','NO_SABE') DEFAULT 'NO_SABE' COMMENT 'Diabetes en familiares',
    strHipertension ENUM('SI','NO','NO_SABE') DEFAULT 'NO_SABE' COMMENT 'Hipertensión en familiares',
    strCancer ENUM('SI','NO','NO_SABE') DEFAULT 'NO_SABE' COMMENT 'Cáncer en familiares',
    strCardiopatias ENUM('SI','NO','NO_SABE') DEFAULT 'NO_SABE' COMMENT 'Enfermedades cardíacas',
    strEnfermedadesRenales ENUM('SI','NO','NO_SABE') DEFAULT 'NO_SABE',
    txtDetallesHeredo TEXT COMMENT 'Detalles adicionales de antecedentes heredofamiliares',
    
    -- ============================================
    -- ANTECEDENTES PERSONALES PATOLÓGICOS
    -- ============================================
    txtCirugiasPrevias TEXT COMMENT 'Cirugías realizadas (fecha y tipo)',
    txtHospitalizaciones TEXT COMMENT 'Hospitalizaciones previas',
    txtTransfusiones TEXT COMMENT 'Transfusiones sanguíneas',
    txtFracturas TEXT COMMENT 'Fracturas o traumatismos',
    txtAlergiasMedicamentos TEXT COMMENT 'Alergias medicamentosas',
    txtEnfermedadesCronicas TEXT COMMENT 'Enfermedades crónicas diagnosticadas',
    
    -- ============================================
    -- ANTECEDENTES PERSONALES NO PATOLÓGICOS
    -- ============================================
    strTabaquismo ENUM('SI','NO','EX_FUMADOR') DEFAULT 'NO',
    intCigarrillosDia INT DEFAULT 0 COMMENT 'Cigarrillos por día (si fuma)',
    intAniosFumando INT DEFAULT 0,
    
    strAlcoholismo ENUM('SI','NO','OCASIONAL') DEFAULT 'NO',
    strFrecuenciaAlcohol VARCHAR(100) COMMENT 'Frecuencia de consumo de alcohol',
    
    strDrogas ENUM('SI','NO') DEFAULT 'NO',
    txtTipoDrogas VARCHAR(200) COMMENT 'Tipo de drogas consumidas',
    
    strActividadFisica VARCHAR(100) COMMENT 'Frecuencia de ejercicio (sedentario, ligero, moderado, intenso)',
    txtAlimentacion TEXT COMMENT 'Descripción de hábitos alimenticios',
    
    -- ============================================
    -- ANTECEDENTES GINECO-OBSTÉTRICOS (solo mujeres)
    -- ============================================
    intMenarca INT COMMENT 'Edad de primera menstruación',
    datFechaUltimaMenstruacion DATE COMMENT 'Fecha de última menstruación (FUM)',
    intGestas INT DEFAULT 0 COMMENT 'Número de embarazos',
    intPartos INT DEFAULT 0 COMMENT 'Número de partos',
    intCesareas INT DEFAULT 0 COMMENT 'Número de cesáreas',
    intAbortos INT DEFAULT 0 COMMENT 'Número de abortos',
    txtMetodoAnticonceptivo VARCHAR(200) COMMENT 'Método anticonceptivo actual',
    txtComplicacionesObstetricas TEXT COMMENT 'Complicaciones en embarazos previos',
    
    -- ============================================
    -- CONTROL
    -- ============================================
    datFechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    datFechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    intDoctorRegistro INT COMMENT 'Doctor que registró la historia',
    isCompleto TINYINT(1) DEFAULT 0 COMMENT 'Indica si la historia está completa',
    
    PRIMARY KEY (intHistoriaClinica),
    UNIQUE KEY unique_paciente (intPaciente),
    CONSTRAINT fk_HistoriaClinica_Paciente FOREIGN KEY (intPaciente) REFERENCES tbPacientes(intPaciente) ON DELETE CASCADE,
    INDEX idx_paciente (intPaciente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLA: tbEstudios
-- Descripción: Estudios de laboratorio, gabinete e imagen
-- =============================================

CREATE TABLE IF NOT EXISTS tbEstudios (
    intEstudio INT NOT NULL AUTO_INCREMENT,
    intPaciente INT NOT NULL,
    intDoctor INT NOT NULL COMMENT 'Doctor que solicitó el estudio',
    intConsulta INT COMMENT 'Consulta donde se solicitó (opcional)',
    
    strTipoEstudio ENUM(
        'LABORATORIO',
        'RAYOS_X',
        'ULTRASONIDO',
        'TOMOGRAFIA',
        'RESONANCIA_MAGNETICA',
        'ELECTROCARDIOGRAMA',
        'ENDOSCOPIA',
        'BIOPSIA',
        'OTRO'
    ) NOT NULL,
    
    strNombreEstudio VARCHAR(200) NOT NULL COMMENT 'Ej: Biometría Hemática Completa',
    txtIndicaciones TEXT COMMENT 'Indicaciones para el paciente (ayuno, etc)',
    
    datFechaSolicitud DATE NOT NULL,
    datFechaResultado DATE COMMENT 'Fecha en que se obtuvieron los resultados',
    
    txtResultados TEXT COMMENT 'Resultados en texto plano',
    txtInterpretacion TEXT COMMENT 'Interpretación médica de los resultados',
    
    strRutaArchivo VARCHAR(500) COMMENT 'Ruta al archivo PDF/imagen en servidor',
    strNombreArchivo VARCHAR(255) COMMENT 'Nombre original del archivo',
    dblTamanoArchivo DECIMAL(10,2) COMMENT 'Tamaño del archivo en MB',
    
    strEstatus ENUM('PENDIENTE','EN_PROCESO','COMPLETADO','CANCELADO') DEFAULT 'PENDIENTE',
    
    txtObservaciones TEXT COMMENT 'Observaciones adicionales',
    
    datFechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    datFechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isEliminado TINYINT(1) DEFAULT 0,
    
    PRIMARY KEY (intEstudio),
    CONSTRAINT fk_Estudios_Paciente FOREIGN KEY (intPaciente) REFERENCES tbPacientes(intPaciente) ON DELETE CASCADE,
    CONSTRAINT fk_Estudios_Doctor FOREIGN KEY (intDoctor) REFERENCES tbDoctores(intDoctor),
    CONSTRAINT fk_Estudios_Consulta FOREIGN KEY (intConsulta) REFERENCES tbConsultas(intConsulta),
    
    INDEX idx_paciente (intPaciente),
    INDEX idx_doctor (intDoctor),
    INDEX idx_fecha_solicitud (datFechaSolicitud),
    INDEX idx_estatus (strEstatus),
    INDEX idx_tipo (strTipoEstudio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLA: tbArchivosAdjuntos
-- Descripción: Archivos y documentos adjuntos al expediente
-- =============================================

CREATE TABLE IF NOT EXISTS tbArchivosAdjuntos (
    intArchivo INT NOT NULL AUTO_INCREMENT,
    intPaciente INT NOT NULL,
    intDoctor INT COMMENT 'Usuario que subió el archivo',
    intConsulta INT COMMENT 'Consulta relacionada (opcional)',
    
    strNombreArchivo VARCHAR(255) NOT NULL,
    strRutaArchivo VARCHAR(500) NOT NULL COMMENT 'Ruta en el servidor',
    
    strTipoArchivo VARCHAR(50) COMMENT 'PDF, JPG, PNG, DOCX, etc',
    dblTamanoArchivo DECIMAL(10,2) COMMENT 'Tamaño en MB',
    
    strCategoria ENUM(
        'ESTUDIO',
        'CONSENTIMIENTO',
        'IMAGEN',
        'DOCUMENTO_LEGAL',
        'RECETA',
        'REFERENCIA',
        'OTRO'
    ) DEFAULT 'OTRO',
    
    txtDescripcion TEXT COMMENT 'Descripción del archivo',
    txtNotas TEXT COMMENT 'Notas adicionales',
    
    datFechaSubida DATETIME DEFAULT CURRENT_TIMESTAMP,
    isEliminado TINYINT(1) DEFAULT 0,
    
    PRIMARY KEY (intArchivo),
    CONSTRAINT fk_Archivos_Paciente FOREIGN KEY (intPaciente) REFERENCES tbPacientes(intPaciente) ON DELETE CASCADE,
    CONSTRAINT fk_Archivos_Doctor FOREIGN KEY (intDoctor) REFERENCES tbDoctores(intDoctor),
    CONSTRAINT fk_Archivos_Consulta FOREIGN KEY (intConsulta) REFERENCES tbConsultas(intConsulta),
    
    INDEX idx_paciente (intPaciente),
    INDEX idx_categoria (strCategoria),
    INDEX idx_fecha (datFechaSubida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLA: tbRecetas (Mejorada y estructurada)
-- Descripción: Recetas médicas formales con folio
-- =============================================

CREATE TABLE IF NOT EXISTS tbRecetas (
    intReceta INT NOT NULL AUTO_INCREMENT,
    intConsulta INT NOT NULL,
    intPaciente INT NOT NULL,
    intDoctor INT NOT NULL,
    
    strFolio VARCHAR(50) UNIQUE NOT NULL COMMENT 'Folio único RX-00001',
    datFechaEmision DATE NOT NULL,
    
    txtIndicacionesGenerales TEXT COMMENT 'Indicaciones generales de la receta',
    
    strEstatus ENUM('ACTIVA','VENCIDA','CANCELADA') DEFAULT 'ACTIVA',
    datFechaVencimiento DATE COMMENT 'Fecha de vencimiento de la receta',
    
    strRutaPDF VARCHAR(500) COMMENT 'Ruta al PDF generado',
    
    datFechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    datFechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isEliminado TINYINT(1) DEFAULT 0,
    
    PRIMARY KEY (intReceta),
    UNIQUE KEY unique_folio (strFolio),
    CONSTRAINT fk_Recetas_Consulta FOREIGN KEY (intConsulta) REFERENCES tbConsultas(intConsulta),
    CONSTRAINT fk_Recetas_Paciente FOREIGN KEY (intPaciente) REFERENCES tbPacientes(intPaciente) ON DELETE CASCADE,
    CONSTRAINT fk_Recetas_Doctor FOREIGN KEY (intDoctor) REFERENCES tbDoctores(intDoctor),
    
    INDEX idx_paciente (intPaciente),
    INDEX idx_doctor (intDoctor),
    INDEX idx_fecha (datFechaEmision),
    INDEX idx_estatus (strEstatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLA: tbRecetaMedicamentos
-- Descripción: Detalle de medicamentos por receta
-- =============================================

CREATE TABLE IF NOT EXISTS tbRecetaMedicamentos (
    intRecetaMedicamento INT NOT NULL AUTO_INCREMENT,
    intReceta INT NOT NULL,
    
    strMedicamento VARCHAR(200) NOT NULL COMMENT 'Nombre del medicamento',
    strPresentacion VARCHAR(100) COMMENT 'Tabletas, cápsulas, jarabe, etc',
    strDosis VARCHAR(100) COMMENT 'Ej: 1 tableta cada 8 horas',
    intCantidad INT COMMENT 'Cantidad total a dispensar',
    intDiasTratamiento INT COMMENT 'Duración del tratamiento en días',
    txtIndicaciones TEXT COMMENT 'Indicaciones específicas del medicamento',
    
    datFechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (intRecetaMedicamento),
    CONSTRAINT fk_RecetaMed_Receta FOREIGN KEY (intReceta) REFERENCES tbRecetas(intReceta) ON DELETE CASCADE,
    INDEX idx_receta (intReceta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- VISTA: vw_ExpedienteCompleto
-- Descripción: Vista consolidada del expediente del paciente
-- =============================================

CREATE OR REPLACE VIEW vw_ExpedienteCompleto AS
SELECT 
    p.intPaciente,
    p.strNombre AS strNombrePaciente,
    p.strGenero,
    p.datFechaNacimiento,
    p.intEdad,
    p.strEmail,
    p.strTelefono,
    p.strTipoSangre,
    p.strAlergias,
    p.strEnfermedadesCronicas,
    p.strEstatus,
    
    -- Historia Clínica
    hc.intHistoriaClinica,
    hc.isCompleto AS historiaCompleta,
    hc.strTabaquismo,
    hc.strAlcoholismo,
    hc.strDiabetes AS heredoDiabetes,
    hc.strHipertension AS heredoHipertension,
    
    -- Contadores
    (SELECT COUNT(*) FROM tbConsultas WHERE intPaciente = p.intPaciente AND isEliminado = 0) AS totalConsultas,
    (SELECT COUNT(*) FROM tbEstudios WHERE intPaciente = p.intPaciente AND isEliminado = 0) AS totalEstudios,
    (SELECT COUNT(*) FROM tbArchivosAdjuntos WHERE intPaciente = p.intPaciente AND isEliminado = 0) AS totalArchivos,
    (SELECT COUNT(*) FROM tbRecetas WHERE intPaciente = p.intPaciente AND isEliminado = 0) AS totalRecetas,
    
    -- Última consulta
    (SELECT datFechaConsulta FROM tbConsultas WHERE intPaciente = p.intPaciente AND isEliminado = 0 ORDER BY datFechaConsulta DESC LIMIT 1) AS ultimaConsulta,
    (SELECT strDiagnostico FROM tbConsultas WHERE intPaciente = p.intPaciente AND isEliminado = 0 ORDER BY datFechaConsulta DESC LIMIT 1) AS ultimoDiagnostico

FROM tbPacientes p
LEFT JOIN tbHistoriaClinica hc ON p.intPaciente = hc.intPaciente
WHERE p.isEliminado = 0;

-- =============================================
-- PROCEDIMIENTO: sp_ObtenerExpedienteCompleto
-- Descripción: Obtiene toda la información del expediente de un paciente
-- =============================================

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_ObtenerExpedienteCompleto$$

CREATE PROCEDURE sp_ObtenerExpedienteCompleto(
    IN p_intPaciente INT
)
BEGIN
    -- Datos generales del paciente
    SELECT * FROM tbPacientes WHERE intPaciente = p_intPaciente AND isEliminado = 0;
    
    -- Historia clínica
    SELECT * FROM tbHistoriaClinica WHERE intPaciente = p_intPaciente;
    
    -- Consultas (últimas 10)
    SELECT 
        c.*,
        CONCAT(d.strNombre, ' ', d.strApellidos) AS strNombreDoctor,
        e.strNombreEspecialidad
    FROM tbConsultas c
    INNER JOIN tbDoctores d ON c.intDoctor = d.intDoctor
    LEFT JOIN tbEspecialidades e ON d.intEspecialidad = e.intEspecialidad
    WHERE c.intPaciente = p_intPaciente AND c.isEliminado = 0
    ORDER BY c.datFechaConsulta DESC
    LIMIT 10;
    
    -- Estudios pendientes y recientes
    SELECT 
        e.*,
        CONCAT(d.strNombre, ' ', d.strApellidos) AS strNombreDoctor
    FROM tbEstudios e
    INNER JOIN tbDoctores d ON e.intDoctor = d.intDoctor
    WHERE e.intPaciente = p_intPaciente AND e.isEliminado = 0
    ORDER BY e.datFechaSolicitud DESC
    LIMIT 10;
    
    -- Archivos adjuntos recientes
    SELECT 
        a.*,
        CONCAT(d.strNombre, ' ', d.strApellidos) AS strNombreDoctor
    FROM tbArchivosAdjuntos a
    LEFT JOIN tbDoctores d ON a.intDoctor = d.intDoctor
    WHERE a.intPaciente = p_intPaciente AND a.isEliminado = 0
    ORDER BY a.datFechaSubida DESC
    LIMIT 10;
    
    -- Recetas activas
    SELECT 
        r.*,
        CONCAT(d.strNombre, ' ', d.strApellidos) AS strNombreDoctor
    FROM tbRecetas r
    INNER JOIN tbDoctores d ON r.intDoctor = d.intDoctor
    WHERE r.intPaciente = p_intPaciente AND r.isEliminado = 0
    ORDER BY r.datFechaEmision DESC
    LIMIT 10;
    
END$$

DELIMITER ;

-- =============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =============================================

-- Para búsquedas rápidas en el expediente
CREATE INDEX idx_consultas_paciente_fecha ON tbConsultas(intPaciente, datFechaConsulta DESC);
CREATE INDEX idx_estudios_paciente_fecha ON tbEstudios(intPaciente, datFechaSolicitud DESC);
CREATE INDEX idx_archivos_paciente_fecha ON tbArchivosAdjuntos(intPaciente, datFechaSubida DESC);

-- =============================================
-- DATOS DE EJEMPLO (Opcional - comentado)
-- =============================================

/*
-- Insertar historia clínica de ejemplo
INSERT INTO tbHistoriaClinica (
    intPaciente,
    strDiabetes,
    strHipertension,
    strTabaquismo,
    strAlcoholismo,
    strActividadFisica,
    isCompleto
) VALUES (
    1,
    'SI',
    'SI',
    'NO',
    'OCASIONAL',
    'Moderado - 3 veces por semana',
    1
);
*/

-- =============================================
-- FIN DEL SCRIPT
-- =============================================

SELECT '✅ FASE 1: Tablas del Expediente Clínico creadas exitosamente' AS Mensaje;
