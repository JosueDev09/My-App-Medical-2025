-- =============================================
-- FASE 2: DIAGNÓSTICOS CIE-10
-- Script de Base de Datos
-- Fecha: Abril 2026
-- =============================================

-- =============================================
-- TABLA: tbCatalogoCIE10
-- Descripción: Catálogo de códigos CIE-10 (Clasificación Internacional de Enfermedades)
-- =============================================

CREATE TABLE IF NOT EXISTS tbCatalogoCIE10 (
    intCIE10 INT NOT NULL AUTO_INCREMENT,
    strCodigo VARCHAR(10) NOT NULL UNIQUE COMMENT 'Código CIE-10 (ej: A00, E11.9)',
    strDescripcion VARCHAR(500) NOT NULL COMMENT 'Descripción de la enfermedad',
    strCategoria VARCHAR(100) COMMENT 'Categoría general (ej: Enfermedades infecciosas)',
    strCapitulo VARCHAR(200) COMMENT 'Capítulo CIE-10',
    txtNotas TEXT COMMENT 'Notas adicionales o aclaraciones',
    isActivo TINYINT(1) DEFAULT 1,
    datFechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (intCIE10),
    UNIQUE KEY unique_codigo (strCodigo),
    INDEX idx_codigo (strCodigo),
    INDEX idx_categoria (strCategoria),
    INDEX idx_activo (isActivo),
    FULLTEXT INDEX idx_descripcion (strDescripcion, strCategoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLA: tbConsultaDiagnosticos
-- Descripción: Relación entre consultas y diagnósticos CIE-10
-- =============================================

CREATE TABLE IF NOT EXISTS tbConsultaDiagnosticos (
    intConsultaDiagnostico INT NOT NULL AUTO_INCREMENT,
    intConsulta INT NOT NULL,
    intCIE10 INT NOT NULL,
    
    strTipoDiagnostico ENUM(
        'PRINCIPAL',
        'SECUNDARIO',
        'PRESUNTIVO',
        'CONFIRMADO',
        'COMORBILIDAD'
    ) DEFAULT 'PRINCIPAL' COMMENT 'Tipo de diagnóstico',
    
    txtNotasDiagnostico TEXT COMMENT 'Notas adicionales del diagnóstico',
    datFechaDiagnostico DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (intConsultaDiagnostico),
    CONSTRAINT fk_ConsultaDx_Consulta FOREIGN KEY (intConsulta) REFERENCES tbConsultas(intConsulta) ON DELETE CASCADE,
    CONSTRAINT fk_ConsultaDx_CIE10 FOREIGN KEY (intCIE10) REFERENCES tbCatalogoCIE10(intCIE10),
    
    INDEX idx_consulta (intConsulta),
    INDEX idx_cie10 (intCIE10),
    INDEX idx_tipo (strTipoDiagnostico)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- DATOS INICIALES CIE-10 (Códigos más comunes en consulta médica)
-- =============================================

INSERT INTO tbCatalogoCIE10 (strCodigo, strDescripcion, strCategoria, strCapitulo) VALUES
-- Capítulo I: Enfermedades infecciosas
('A00', 'Cólera', 'Enfermedades infecciosas intestinales', 'Cap I - Enfermedades infecciosas y parasitarias'),
('A09', 'Diarrea y gastroenteritis de presunto origen infeccioso', 'Enfermedades infecciosas intestinales', 'Cap I - Enfermedades infecciosas y parasitarias'),
('B34.9', 'Infección viral, no especificada', 'Infecciones virales', 'Cap I - Enfermedades infecciosas y parasitarias'),

-- Capítulo IV: Enfermedades endocrinas, nutricionales y metabólicas
('E10', 'Diabetes mellitus tipo 1', 'Diabetes mellitus', 'Cap IV - Enfermedades endocrinas, nutricionales y metabólicas'),
('E11', 'Diabetes mellitus tipo 2', 'Diabetes mellitus', 'Cap IV - Enfermedades endocrinas, nutricionales y metabólicas'),
('E11.9', 'Diabetes mellitus tipo 2 sin complicaciones', 'Diabetes mellitus', 'Cap IV - Enfermedades endocrinas, nutricionales y metabólicas'),
('E66.9', 'Obesidad, no especificada', 'Obesidad', 'Cap IV - Enfermedades endocrinas, nutricionales y metabólicas'),
('E78.5', 'Hiperlipidemia, no especificada', 'Trastornos del metabolismo de las lipoproteínas', 'Cap IV - Enfermedades endocrinas, nutricionales y metabólicas'),

-- Capítulo V: Trastornos mentales y del comportamiento
('F32', 'Episodio depresivo', 'Trastornos del humor', 'Cap V - Trastornos mentales y del comportamiento'),
('F41.1', 'Trastorno de ansiedad generalizada', 'Trastornos de ansiedad', 'Cap V - Trastornos mentales y del comportamiento'),

-- Capítulo IX: Enfermedades del sistema circulatorio
('I10', 'Hipertensión arterial esencial (primaria)', 'Enfermedades hipertensivas', 'Cap IX - Enfermedades del sistema circulatorio'),
('I25.1', 'Enfermedad aterosclerótica del corazón', 'Cardiopatía isquémica crónica', 'Cap IX - Enfermedades del sistema circulatorio'),
('I50.9', 'Insuficiencia cardíaca, no especificada', 'Insuficiencia cardíaca', 'Cap IX - Enfermedades del sistema circulatorio'),

-- Capítulo X: Enfermedades del sistema respiratorio
('J00', 'Rinofaringitis aguda (resfriado común)', 'Infecciones respiratorias agudas', 'Cap X - Enfermedades del sistema respiratorio'),
('J02.9', 'Faringitis aguda, no especificada', 'Infecciones respiratorias agudas', 'Cap X - Enfermedades del sistema respiratorio'),
('J03.9', 'Amigdalitis aguda, no especificada', 'Infecciones respiratorias agudas', 'Cap X - Enfermedades del sistema respiratorio'),
('J06.9', 'Infección aguda de las vías respiratorias superiores', 'Infecciones respiratorias agudas', 'Cap X - Enfermedades del sistema respiratorio'),
('J18.9', 'Neumonía, no especificada', 'Neumonía', 'Cap X - Enfermedades del sistema respiratorio'),
('J20.9', 'Bronquitis aguda, no especificada', 'Bronquitis', 'Cap X - Enfermedades del sistema respiratorio'),
('J45.9', 'Asma, no especificada', 'Asma', 'Cap X - Enfermedades del sistema respiratorio'),

-- Capítulo XI: Enfermedades del sistema digestivo
('K21.9', 'Enfermedad por reflujo gastroesofágico sin esofagitis', 'Enfermedades del esófago', 'Cap XI - Enfermedades del sistema digestivo'),
('K29.7', 'Gastritis, no especificada', 'Gastritis y duodenitis', 'Cap XI - Enfermedades del sistema digestivo'),
('K30', 'Dispepsia funcional', 'Dispepsia', 'Cap XI - Enfermedades del sistema digestivo'),
('K59.0', 'Estreñimiento', 'Otros trastornos intestinales', 'Cap XI - Enfermedades del sistema digestivo'),

-- Capítulo XII: Enfermedades de la piel
('L20.9', 'Dermatitis atópica, no especificada', 'Dermatitis y eczema', 'Cap XII - Enfermedades de la piel y del tejido subcutáneo'),
('L50.9', 'Urticaria, no especificada', 'Urticaria y eritema', 'Cap XII - Enfermedades de la piel y del tejido subcutáneo'),

-- Capítulo XIII: Enfermedades del sistema musculoesquelético
('M25.5', 'Dolor en articulación', 'Otros trastornos articulares', 'Cap XIII - Enfermedades del sistema musculoesquelético'),
('M54.5', 'Dolor lumbar bajo', 'Dorsalgias', 'Cap XIII - Enfermedades del sistema musculoesquelético'),
('M79.1', 'Mialgia', 'Otros trastornos de los tejidos blandos', 'Cap XIII - Enfermedades del sistema musculoesquelético'),

-- Capítulo XIV: Enfermedades del sistema genitourinario
('N39.0', 'Infección de vías urinarias, sitio no especificado', 'Infecciones urinarias', 'Cap XIV - Enfermedades del sistema genitourinario'),

-- Capítulo XVIII: Síntomas y signos generales
('R05', 'Tos', 'Síntomas y signos respiratorios', 'Cap XVIII - Síntomas, signos y hallazgos anormales'),
('R06.0', 'Disnea', 'Síntomas y signos respiratorios', 'Cap XVIII - Síntomas, signos y hallazgos anormales'),
('R10.4', 'Otros dolores abdominales y los no especificados', 'Síntomas y signos digestivos', 'Cap XVIII - Síntomas, signos y hallazgos anormales'),
('R50.9', 'Fiebre, no especificada', 'Síntomas generales', 'Cap XVIII - Síntomas, signos y hallazgos anormales'),
('R51', 'Cefalea', 'Síntomas generales', 'Cap XVIII - Síntomas, signos y hallazgos anormales'),

-- Capítulo XIX: Traumatismos
('S06.0', 'Conmoción cerebral', 'Traumatismos de la cabeza', 'Cap XIX - Traumatismos, envenenamientos'),

-- Capítulo XXI: Factores que influyen en el estado de salud
('Z00.0', 'Examen médico general', 'Exámenes médicos', 'Cap XXI - Factores que influyen en el estado de salud'),
('Z01.8', 'Otros exámenes especiales especificados', 'Exámenes especiales', 'Cap XXI - Factores que influyen en el estado de salud'),
('Z23', 'Necesidad de inmunización contra enfermedad bacteriana única', 'Inmunizaciones', 'Cap XXI - Factores que influyen en el estado de salud');

-- =============================================
-- VISTA: vw_ConsultasDiagnosticos
-- Descripción: Vista consolidada de consultas con sus diagnósticos
-- =============================================

CREATE OR REPLACE VIEW vw_ConsultasDiagnosticos AS
SELECT 
    c.intConsulta,
    c.intPaciente,
    c.datFechaConsulta,
    c.strMotivoConsulta,
    
    p.strNombre AS strNombrePaciente,
    CONCAT(d.strNombre, ' ', d.strApellidos) AS strNombreDoctor,
    
    cd.intConsultaDiagnostico,
    cd.strTipoDiagnostico,
    cd.txtNotasDiagnostico,
    
    cie.intCIE10,
    cie.strCodigo AS strCodigoCIE10,
    cie.strDescripcion AS strDescripcionDiagnostico,
    cie.strCategoria,
    cie.strCapitulo

FROM tbConsultas c
LEFT JOIN tbConsultaDiagnosticos cd ON c.intConsulta = cd.intConsulta
LEFT JOIN tbCatalogoCIE10 cie ON cd.intCIE10 = cie.intCIE10
INNER JOIN tbPacientes p ON c.intPaciente = p.intPaciente
INNER JOIN tbDoctores d ON c.intDoctor = d.intDoctor
WHERE c.isEliminado = 0;

-- =============================================
-- PROCEDIMIENTO: sp_BuscarCIE10
-- Descripción: Busca códigos CIE-10 por término de búsqueda
-- =============================================

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_BuscarCIE10$$

CREATE PROCEDURE sp_BuscarCIE10(
    IN p_termino VARCHAR(200)
)
BEGIN
    SELECT 
        intCIE10,
        strCodigo,
        strDescripcion,
        strCategoria,
        strCapitulo
    FROM tbCatalogoCIE10
    WHERE isActivo = 1
        AND (
            strCodigo LIKE CONCAT('%', p_termino, '%')
            OR strDescripcion LIKE CONCAT('%', p_termino, '%')
            OR strCategoria LIKE CONCAT('%', p_termino, '%')
        )
    ORDER BY strCodigo
    LIMIT 50;
END$$

DELIMITER ;

-- =============================================
-- PROCEDIMIENTO: sp_ObtenerDiagnosticosConsulta
-- Descripción: Obtiene todos los diagnósticos de una consulta
-- =============================================

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_ObtenerDiagnosticosConsulta$$

CREATE PROCEDURE sp_ObtenerDiagnosticosConsulta(
    IN p_intConsulta INT
)
BEGIN
    SELECT 
        cd.intConsultaDiagnostico,
        cd.strTipoDiagnostico,
        cd.txtNotasDiagnostico,
        cd.datFechaDiagnostico,
        cie.intCIE10,
        cie.strCodigo,
        cie.strDescripcion,
        cie.strCategoria
    FROM tbConsultaDiagnosticos cd
    INNER JOIN tbCatalogoCIE10 cie ON cd.intCIE10 = cie.intCIE10
    WHERE cd.intConsulta = p_intConsulta
    ORDER BY 
        CASE cd.strTipoDiagnostico
            WHEN 'PRINCIPAL' THEN 1
            WHEN 'CONFIRMADO' THEN 2
            WHEN 'SECUNDARIO' THEN 3
            WHEN 'PRESUNTIVO' THEN 4
            WHEN 'COMORBILIDAD' THEN 5
        END;
END$$

DELIMITER ;

-- =============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =============================================

CREATE INDEX idx_consulta_diagnosticos_fecha ON tbConsultaDiagnosticos(datFechaDiagnostico);
CREATE INDEX idx_cie10_activo_codigo ON tbCatalogoCIE10(isActivo, strCodigo);

-- =============================================
-- FIN DEL SCRIPT FASE 2
-- =============================================

SELECT '✅ FASE 2: Tablas de Diagnósticos CIE-10 creadas exitosamente' AS Mensaje;
SELECT CONCAT('✅ Se insertaron ', COUNT(*), ' códigos CIE-10 iniciales') AS Mensaje FROM tbCatalogoCIE10;
