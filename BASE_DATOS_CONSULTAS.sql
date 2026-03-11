-- =============================================
-- Script de Base de Datos para Sistema de Consultas Médicas
-- Tablas: tbConsultas y tbConsultaSignosVitales
-- =============================================

-- =============================================
-- TABLA: tbConsultas
-- Descripción: Almacena información de las consultas médicas realizadas
-- =============================================

CREATE TABLE IF NOT EXISTS tbConsultas (
    intConsulta INT NOT NULL AUTO_INCREMENT,
    intPaciente INT NOT NULL,
    intCita INT NULL,
    intDoctor INT NOT NULL,

    datFechaConsulta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    strMotivoConsulta VARCHAR(255) NOT NULL,
    strPadecimientoActual TEXT NULL,
    strExploracionFisica TEXT NULL,
    strNotasConsulta TEXT NULL,
    strDiagnostico TEXT NULL,
    strTratamiento TEXT NULL,
    strIndicaciones TEXT NULL,
    strPronostico TEXT NULL,

    datProximaConsulta DATETIME NULL,

    strEstatusConsulta ENUM('ABIERTA','FINALIZADA','CANCELADA') DEFAULT 'ABIERTA',

    datFechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    datFechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isEliminado TINYINT(1) DEFAULT 0,

    PRIMARY KEY (intConsulta),
    INDEX idx_paciente (intPaciente),
    INDEX idx_doctor (intDoctor),
    INDEX idx_cita (intCita),
    INDEX idx_fecha (datFechaConsulta),
    CONSTRAINT fk_tbConsultas_Paciente FOREIGN KEY (intPaciente) REFERENCES tbPacientes(intPaciente),
    CONSTRAINT fk_tbConsultas_Cita FOREIGN KEY (intCita) REFERENCES tbCitas(intCita),
    CONSTRAINT fk_tbConsultas_Doctor FOREIGN KEY (intDoctor) REFERENCES tbDoctores(intDoctor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLA: tbConsultaSignosVitales
-- Descripción: Almacena los signos vitales registrados en cada consulta
-- =============================================

CREATE TABLE IF NOT EXISTS tbConsultaSignosVitales (
    intSignoVital INT NOT NULL AUTO_INCREMENT,
    intConsulta INT NOT NULL,

    dblPeso DECIMAL(10,2) NULL COMMENT 'Peso en kilogramos',
    dblTalla DECIMAL(10,2) NULL COMMENT 'Talla en metros',
    dblIMC DECIMAL(10,2) NULL COMMENT 'Índice de Masa Corporal calculado',
    strPresionArterial VARCHAR(20) NULL COMMENT 'Presión arterial (ej: 120/80)',
    intFrecuenciaCardiaca INT NULL COMMENT 'Frecuencia cardíaca en latidos por minuto',
    intFrecuenciaRespiratoria INT NULL COMMENT 'Frecuencia respiratoria en respiraciones por minuto',
    dblTemperatura DECIMAL(10,2) NULL COMMENT 'Temperatura corporal en grados Celsius',
    dblGlucosa DECIMAL(10,2) NULL COMMENT 'Nivel de glucosa en mg/dL',
    dblSaturacionOxigeno DECIMAL(10,2) NULL COMMENT 'Saturación de oxígeno en porcentaje',

    datFechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (intSignoVital),
    INDEX idx_consulta (intConsulta),
    CONSTRAINT fk_tbConsultaSignosVitales_Consulta FOREIGN KEY (intConsulta) REFERENCES tbConsultas(intConsulta) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- ÍNDICES ADICIONALES PARA MEJORAR RENDIMIENTO
-- =============================================

-- Índice compuesto para búsquedas por paciente y fecha
CREATE INDEX idx_consulta_paciente_fecha ON tbConsultas(intPaciente, datFechaConsulta);

-- Índice para búsquedas por doctor y fecha
CREATE INDEX idx_consulta_doctor_fecha ON tbConsultas(intDoctor, datFechaConsulta);

-- Índice para filtrar por estatus
CREATE INDEX idx_consulta_estatus ON tbConsultas(strEstatusConsulta);

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger para actualizar automáticamente datFechaActualizacion
DELIMITER $$

CREATE TRIGGER trg_tbConsultas_before_update
BEFORE UPDATE ON tbConsultas
FOR EACH ROW
BEGIN
    SET NEW.datFechaActualizacion = NOW();
END$$

DELIMITER ;

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista: Consultas con información completa del paciente y doctor
CREATE OR REPLACE VIEW vw_ConsultasCompletas AS
SELECT 
    c.intConsulta,
    c.datFechaConsulta,
    c.strMotivoConsulta,
    c.strDiagnostico,
    c.strEstatusConsulta,
    
    -- Información del Paciente
    p.intPaciente,
    CONCAT(p.strNombre, ' ', p.strApellidos) as strNombreCompletoPaciente,
    p.strEmail as strEmailPaciente,
    p.strTelefono as strTelefonoPaciente,
    TIMESTAMPDIFF(YEAR, p.datFechaNacimiento, CURDATE()) as intEdadPaciente,
    
    -- Información del Doctor
    d.intDoctor,
    CONCAT(d.strNombre, ' ', d.strApellidos) as strNombreCompletoDoctor,
    e.strNombreEspecialidad,
    
    -- Signos Vitales
    sv.dblPeso,
    sv.dblTalla,
    sv.dblIMC,
    sv.strPresionArterial,
    sv.intFrecuenciaCardiaca,
    sv.dblTemperatura
    
FROM tbConsultas c
INNER JOIN tbPacientes p ON c.intPaciente = p.intPaciente
INNER JOIN tbDoctores d ON c.intDoctor = d.intDoctor
LEFT JOIN tbEspecialidades e ON d.intEspecialidad = e.intEspecialidad
LEFT JOIN tbConsultaSignosVitales sv ON c.intConsulta = sv.intConsulta
WHERE c.isEliminado = 0;

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS
-- =============================================

-- Procedimiento: Obtener historial de consultas de un paciente
DELIMITER $$

CREATE PROCEDURE sp_ObtenerHistorialConsultas(
    IN p_intPaciente INT
)
BEGIN
    SELECT 
        c.*,
        CONCAT(d.strNombre, ' ', d.strApellidos) as strNombreDoctor,
        e.strNombreEspecialidad,
        sv.dblPeso,
        sv.dblTalla,
        sv.dblIMC,
        sv.strPresionArterial,
        sv.intFrecuenciaCardiaca,
        sv.intFrecuenciaRespiratoria,
        sv.dblTemperatura,
        sv.dblGlucosa,
        sv.dblSaturacionOxigeno
    FROM tbConsultas c
    INNER JOIN tbDoctores d ON c.intDoctor = d.intDoctor
    LEFT JOIN tbEspecialidades e ON d.intEspecialidad = e.intEspecialidad
    LEFT JOIN tbConsultaSignosVitales sv ON c.intConsulta = sv.intConsulta
    WHERE c.intPaciente = p_intPaciente 
        AND c.isEliminado = 0
    ORDER BY c.datFechaConsulta DESC;
END$$

DELIMITER ;

-- Procedimiento: Obtener detalles completos de una consulta
DELIMITER $$

CREATE PROCEDURE sp_ObtenerDetalleConsulta(
    IN p_intConsulta INT
)
BEGIN
    SELECT 
        c.*,
        CONCAT(p.strNombre, ' ', p.strApellidos) as strNombreCompletoPaciente,
        p.strEmail as strEmailPaciente,
        p.strTelefono as strTelefonoPaciente,
        TIMESTAMPDIFF(YEAR, p.datFechaNacimiento, CURDATE()) as intEdadPaciente,
        CONCAT(d.strNombre, ' ', d.strApellidos) as strNombreCompletoDoctor,
        e.strNombreEspecialidad,
        sv.*
    FROM tbConsultas c
    INNER JOIN tbPacientes p ON c.intPaciente = p.intPaciente
    INNER JOIN tbDoctores d ON c.intDoctor = d.intDoctor
    LEFT JOIN tbEspecialidades e ON d.intEspecialidad = e.intEspecialidad
    LEFT JOIN tbConsultaSignosVitales sv ON c.intConsulta = sv.intConsulta
    WHERE c.intConsulta = p_intConsulta 
        AND c.isEliminado = 0;
END$$

DELIMITER ;

-- =============================================
-- DATOS DE EJEMPLO (OPCIONAL - COMENTAR SI NO SE NECESITA)
-- =============================================

-- Ejemplo de inserción de consulta
-- INSERT INTO tbConsultas (intPaciente, intDoctor, intCita, strMotivoConsulta, strDiagnostico, strTratamiento)
-- VALUES (1, 1, 1, 'Control rutinario', 'Paciente sano', 'Continuar con hábitos saludables');

-- Ejemplo de inserción de signos vitales
-- INSERT INTO tbConsultaSignosVitales (intConsulta, dblPeso, dblTalla, dblIMC, strPresionArterial, intFrecuenciaCardiaca, dblTemperatura)
-- VALUES (1, 70.5, 1.75, 23.02, '120/80', 72, 36.5);

-- =============================================
-- FIN DEL SCRIPT
-- =============================================
