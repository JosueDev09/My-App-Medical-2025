-- =============================================
-- FIX: Error de Collation en búsqueda CIE-10
-- =============================================

-- Eliminar stored procedure anterior
DROP PROCEDURE IF EXISTS sp_BuscarCIE10;

-- Recrear con collation correcta
DELIMITER $$

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
            strCodigo COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_termino COLLATE utf8mb4_unicode_ci, '%')
            OR strDescripcion COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_termino COLLATE utf8mb4_unicode_ci, '%')
            OR strCategoria COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_termino COLLATE utf8mb4_unicode_ci, '%')
        )
    ORDER BY strCodigo
    LIMIT 50;
END$$

DELIMITER ;

-- Verificar que la tabla tenga la collation correcta
ALTER TABLE tbCatalogoCIE10 
    CONVERT TO CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

SELECT '✅ Stored procedure sp_BuscarCIE10 actualizado' AS Mensaje;
SELECT '✅ Tabla tbCatalogoCIE10 convertida a utf8mb4_unicode_ci' AS Mensaje;
