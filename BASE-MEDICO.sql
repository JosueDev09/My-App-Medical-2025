-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: dbmedical
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbcitas`
--

DROP TABLE IF EXISTS `tbcitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbcitas` (
  `intCita` int NOT NULL AUTO_INCREMENT,
  `strNombrePaciente` varchar(100) NOT NULL,
  `intEdad` int NOT NULL,
  `strGenero` varchar(100) NOT NULL,
  `strCorreoPaciente` varchar(100) DEFAULT NULL,
  `strTelefonoPaciente` varchar(20) DEFAULT NULL,
  `idEspecialidad` int NOT NULL,
  `intDoctor` int NOT NULL,
  `datFecha` date NOT NULL,
  `intHora` varchar(20) NOT NULL,
  `strEstatusPago` enum('pendiente','pagado') DEFAULT 'pendiente',
  `dblTotal` decimal(10,2) NOT NULL,
  `strFolio` varchar(50) NOT NULL,
  `strMotivo` varchar(250) NOT NULL,
  `datFechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  `datFechaModificacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `strMetodoPago` varchar(100) NOT NULL,
  PRIMARY KEY (`intCita`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbcitas`
--

LOCK TABLES `tbcitas` WRITE;
/*!40000 ALTER TABLE `tbcitas` DISABLE KEYS */;
INSERT INTO `tbcitas` VALUES (1,'Josue Flores',26,'Masculino','josuecumtual2024@gmail.com','5584893998',1,0,'2025-05-23','15:00','pagado',500.00,'DP-00001','Prueba','2025-05-23 12:24:30','2026-02-25 13:04:49','Efectivo');
/*!40000 ALTER TABLE `tbcitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbdoctores`
--

DROP TABLE IF EXISTS `tbdoctores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbdoctores` (
  `intDoctor` int NOT NULL AUTO_INCREMENT,
  `strNombre` varchar(100) NOT NULL,
  `strApellidos` varchar(100) NOT NULL,
  `datFechaNacimiento` varchar(100) DEFAULT NULL,
  `strSexo` varchar(150) DEFAULT NULL,
  `strEstado` varchar(100) DEFAULT NULL,
  `strCiudad` varchar(100) DEFAULT NULL,
  `strTelefono` varchar(20) DEFAULT NULL,
  `strCorreo` varchar(150) DEFAULT NULL,
  `strDireccion` varchar(150) DEFAULT NULL,
  `datFechaRegistro` datetime DEFAULT NULL,
  PRIMARY KEY (`intDoctor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbdoctores`
--

LOCK TABLES `tbdoctores` WRITE;
/*!40000 ALTER TABLE `tbdoctores` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbdoctores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbempresa`
--

DROP TABLE IF EXISTS `tbempresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbempresa` (
  `intEmpresa` int NOT NULL AUTO_INCREMENT,
  `strCodigo` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `strNombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `strRFC` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `strTelefono` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `strEmail` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `strDireccion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `strCiudad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `strEstado` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `strCP` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `strResponsable` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `strTipoEmpresa` enum('Clínica','Laboratorio','Farmacia','Hospital','Empresa') COLLATE utf8mb4_general_ci DEFAULT 'Clínica',
  `intEstatus` bit(1) DEFAULT b'1',
  `datFechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intEmpresa`),
  UNIQUE KEY `strCodigo` (`strCodigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbempresa`
--

LOCK TABLES `tbempresa` WRITE;
/*!40000 ALTER TABLE `tbempresa` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbempresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbespecialidades`
--

DROP TABLE IF EXISTS `tbespecialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbespecialidades` (
  `intEspecialidad` int NOT NULL AUTO_INCREMENT,
  `strNombreEspecialidad` varchar(100) NOT NULL,
  `strDescripcion` varchar(100) DEFAULT NULL,
  `intEstatus` int DEFAULT NULL,
  `datFechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intEspecialidad`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbespecialidades`
--

LOCK TABLES `tbespecialidades` WRITE;
/*!40000 ALTER TABLE `tbespecialidades` DISABLE KEYS */;
INSERT INTO `tbespecialidades` VALUES (1,'Medicina General','Atención médica primaria para adultos y niños',NULL,'2025-05-21 16:01:19'),(2,'Pediatría','Especialidad médica enfocada en la salud infantil',NULL,'2025-05-21 16:01:19'),(3,'Ginecología','Atención médica para el sistema reproductivo femenino',NULL,'2025-05-21 16:01:19'),(4,'Dermatología','Diagnóstico y tratamiento de enfermedades de la piel',NULL,'2025-05-21 16:01:19'),(5,'Traumatología','Tratamiento de lesiones musculoesqueléticas',NULL,'2025-05-21 16:01:19'),(6,'Psiquiatría','Atención a la salud mental y trastornos psiquiátricos',NULL,'2025-05-21 16:01:19'),(7,'Cardiología','Especialidad enfocada en el sistema cardiovascular',NULL,'2025-05-21 16:01:19');
/*!40000 ALTER TABLE `tbespecialidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbpacientes`
--

DROP TABLE IF EXISTS `tbpacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbpacientes` (
  `intPaciente` int NOT NULL AUTO_INCREMENT,
  `strNombre` varchar(150) NOT NULL,
  `strApellidoPaterno` varchar(100) DEFAULT NULL,
  `strApellidoMaterno` varchar(100) DEFAULT NULL,
  `strGenero` enum('MASCULINO','FEMENINO','OTRO') DEFAULT 'OTRO',
  `datFechaNacimiento` date NOT NULL,
  `strCurp` varchar(18) DEFAULT NULL,
  `strTelefono` varchar(20) NOT NULL,
  `strTelefonoEmergencia` varchar(20) DEFAULT NULL,
  `strEmail` varchar(150) DEFAULT NULL,
  `strDireccion` varchar(255) DEFAULT NULL,
  `strCiudad` varchar(100) DEFAULT NULL,
  `strEstado` varchar(100) DEFAULT NULL,
  `strCodigoPostal` varchar(10) DEFAULT NULL,
  `strTipoSangre` varchar(5) DEFAULT NULL,
  `strAlergias` text,
  `strEnfermedadesCronicas` text,
  `strMedicamentosActuales` text,
  `strEstatus` enum('ACTIVO','INACTIVO','BLOQUEADO') DEFAULT 'ACTIVO',
  `datFechaRegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `datFechaActualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `intUsuarioRegistro` int DEFAULT NULL,
  `isEliminado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`intPaciente`),
  UNIQUE KEY `strCurp` (`strCurp`),
  UNIQUE KEY `strEmail` (`strEmail`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbpacientes`
--

LOCK TABLES `tbpacientes` WRITE;
/*!40000 ALTER TABLE `tbpacientes` DISABLE KEYS */;
INSERT INTO `tbpacientes` VALUES (1,'Josue','Flores','Galindo','MASCULINO','1999-01-13',NULL,'5584893998',NULL,'josue@gmail.com','San Eduardo','Guadalupe','Nuevo Leon','67125',NULL,NULL,NULL,NULL,'ACTIVO','2026-02-25 16:45:07','2026-02-25 16:45:49',NULL,0);
/*!40000 ALTER TABLE `tbpacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbroles`
--

DROP TABLE IF EXISTS `tbroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbroles` (
  `intRol` int NOT NULL AUTO_INCREMENT,
  `strRol` varchar(255) DEFAULT NULL,
  `intEstatus` int DEFAULT NULL,
  PRIMARY KEY (`intRol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbroles`
--

LOCK TABLES `tbroles` WRITE;
/*!40000 ALTER TABLE `tbroles` DISABLE KEYS */;
INSERT INTO `tbroles` VALUES (1,'SuperAdmin',1),(2,'Administrador',1),(3,'Paciente',1),(4,'Doctor',1);
/*!40000 ALTER TABLE `tbroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbusuarios`
--

DROP TABLE IF EXISTS `tbusuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbusuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `strNombre` varchar(255) DEFAULT NULL,
  `strTelefono` varchar(50) DEFAULT NULL,
  `strCorreo` varchar(255) NOT NULL,
  `intRol` int DEFAULT NULL,
  `strTipo_Accion` varchar(50) DEFAULT NULL,
  `datFecha_Alta` datetime DEFAULT NULL,
  `strUsuario` varchar(100) DEFAULT NULL,
  `strContra` varchar(100) DEFAULT NULL,
  `intEmpresa` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `strCorreo` (`strCorreo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbusuarios`
--

LOCK TABLES `tbusuarios` WRITE;
/*!40000 ALTER TABLE `tbusuarios` DISABLE KEYS */;
INSERT INTO `tbusuarios` VALUES (1,'Josue Flores','5584893998','mkt.esymbel2025@gmail.com',1,'LOGIN','2025-05-07 00:00:00','admin','$2b$10$FP/yELvQUwuvcMMrX/rGt.ygygJDBh.kO/8woFsfTP1vDlAElCIVO',1),(2,'Josue Flores',NULL,'josuecumtual2024@gmail.com',3,'LOGIN','2025-05-08 12:11:09',NULL,NULL,NULL),(3,'Josue Flores Galindo',NULL,'josuecode27@gmail.com',3,'LOGIN','2025-05-26 17:16:04',NULL,NULL,NULL);
/*!40000 ALTER TABLE `tbusuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'dbmedical'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_tbCitas_Get_Cita` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbCitas_Get_Cita`(
IN sp_strFolio VARCHAR(100)
)
BEGIN
	SELECT 
    c.strFolio,
    c.strNombrePaciente,
    CAST(c.datFecha AS DATE) datFecha,
    c.intHora,
    d.strNombre,
    UPPER(c.strEstatusPago) strEstatusPago,
    e.strNombreEspecialidad,
    c.dblTotal,
    c.strMetodoPago,
    c.strGenero,
    c.strTelefonoPaciente,
	c.strCorreoPaciente,
    c.strMotivo,
    c.intEdad,
    c.strEstatusPago
    FROM tbCitas c
    LEFT JOIN tbDoctores d ON d.intDoctor = c.intDoctor
    LEFT JOIN tbEspecialidades e ON e.intEspecialidad = c.idEspecialidad
    WHERE c.strFolio = sp_strFolio;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tbCitas_List` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbCitas_List`()
BEGIN
	SELECT 
    c.strFolio,
    c.strNombrePaciente,
    CAST(c.datFecha AS DATE) datFecha,
    c.intHora,
     d.strNombre,
    UPPER(c.strEstatusPago) strEstatusPago,
    e.strNombreEspecialidad,
    c.strEstatusPago
    FROM tbCitas c
    LEFT JOIN tbDoctores d ON d.intDoctor = c.intDoctor
    LEFT JOIN tbEspecialidades e ON e.intEspecialidad = c.idEspecialidad;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tbCitas_List_Usuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbCitas_List_Usuario`(
  IN pUsuario VARCHAR(100)
)
BEGIN
	SELECT 
    c.strFolio,
    c.strNombrePaciente,
    CAST(c.datFecha AS DATE) AS datFecha,
    c.intHora,
    d.strNombreDoctor,
    UPPER(c.strEstatusPago) AS strEstatusPago,
    e.strNombreEspecialidad,
    c.strEstatusPago
  FROM tbCitas c
  INNER JOIN tbDoctores d ON d.intDoctor = c.intDoctor
  INNER JOIN tbEspecialidades e ON e.idEspecialidad = c.idEspecialidad
  WHERE c.strUsuario = pUsuario;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tbCitas_Save` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbCitas_Save`(
IN  sp_strNombrePaciente VARCHAR(100) ,
IN  sp_intEdad int ,
IN  sp_strGenero VARCHAR(100) ,
IN  sp_strCorreoPaciente VARCHAR(100),
IN  sp_strTelefonoPaciente VARCHAR(20),
IN  sp_idEspecialidad INT ,
IN  sp_intDoctor INT ,
IN  sp_datFecha DATE ,
IN  sp_intHora VARCHAR(20) ,
IN  sp_strMotivo VARCHAR(250)
)
BEGIN
  DECLARE vInicialesDoctor VARCHAR(10);
  DECLARE vConsecutivo INT;
  DECLARE vFolioGenerado VARCHAR(50);
  DECLARE vNombreDoctor VARCHAR(100);

  -- Obtener el nombre del doctor
  SELECT strNombreDoctor INTO vNombreDoctor
  FROM tbDoctores
  WHERE intDoctor = sp_intDoctor;

  -- Generar iniciales (tomamos primeras letras de cada palabra)
  SET vInicialesDoctor = UPPER(
    CONCAT(
      LEFT(SUBSTRING_INDEX(vNombreDoctor, ' ', 1), 1),
      IF(LOCATE(' ', vNombreDoctor) > 0, LEFT(SUBSTRING_INDEX(vNombreDoctor, ' ', -1), 1), '')
    )
  );

  -- Calcular el número consecutivo de citas para ese doctor
  SELECT COUNT(*) + 1 INTO vConsecutivo
  FROM tbCitas
  WHERE intDoctor = sp_intDoctor;

  -- Formar el folio con iniciales y número con padding
  SET vFolioGenerado = CONCAT(vInicialesDoctor, '-', LPAD(vConsecutivo, 5, '0'));


	INSERT INTO tbCitas(strNombrePaciente,intEdad,strGenero,strCorreoPaciente,strTelefonoPaciente,idEspecialidad,intDoctor,datFecha,intHora,strEstatusPago,dblTotal,strFolio,strMotivo,datFechaAlta,datFechaModificacion,strMetodoPago)
    VALUES(sp_strNombrePaciente,sp_intEdad ,sp_strGenero ,sp_strCorreoPaciente,sp_strTelefonoPaciente,sp_idEspecialidad,sp_intDoctor,sp_datFecha,sp_intHora,'PENDIENTE','500.00',vFolioGenerado,sp_strMotivo,now(),now(),'PENDIENTE');
    
     SELECT * FROM tbCitas WHERE strFolio = vFolioGenerado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tbDoctores_Get` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbDoctores_Get`(
IN sp_intEspecialidad int
)
BEGIN
	SELECT
    intDoctor,
    strNombreDoctor
    FROM tbDoctores
    WHERE intEspecialidad = sp_intEspecialidad;
    
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tbDoctores_Save` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbDoctores_Save`(
IN p_strNombre VARCHAR(100) ,
IN p_strApellidos VARCHAR(100) ,
IN p_datFechaNacimiento  VARCHAR(100),
IN p_strSexo VARCHAR(150),
IN p_strEstado VARCHAR(100),
IN p_strCiudad VARCHAR(100),
IN p_strTelefono VARCHAR(20),
IN p_strCorreo VARCHAR(150),
IN p_strDireccion VARCHAR(150)
)
BEGIN

IF NOT EXISTS(SELECT 1 FROM tbdoctores WHERE strTelefono = p_strTelefono AND strCorreo = p_strCorreo)
	THEN
		INSERT INTO tbdoctores(strNombre,strApellidos,datFechaNacimiento,strSexo,strEstado,strCiudad,strTelefono,strCorreo,strDireccion,datFechaRegistro)
		VALUES(p_strNombre,p_strApellidos,p_datFechaNacimiento,p_strSexo,p_strEstado,p_strCiudad,p_strTelefono,p_strCorreo,p_strDireccion,now());
		SELECT LAST_INSERT_ID() AS intDoctor;
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tbEspecialidades_Get` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbEspecialidades_Get`()
BEGIN
	SELECT 
    idEspecialidad,
	strNombreEspecialidad,
    strDescripcion
    FROM tbEspecialidades;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_ValidarLoginUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ValidarLoginUsuario`(
IN p_identificador VARCHAR(255)
)
BEGIN
 SELECT 
    id,
    strUsuario,
    strCorreo,
    strContra,
    intRol,
    intEmpresa
  FROM tbUsuarios
  WHERE strCorreo = p_identificador OR strUsuario = p_identificador;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tbUsuarios_Login` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tbUsuarios_Login`(
  IN p_strCorreo VARCHAR(255),
  IN p_strNombre VARCHAR(255)
  )
BEGIN

  DECLARE v_id INT;

  SELECT id INTO v_id FROM tbUsuarios WHERE strCorreo = p_strCorreo;

  IF v_id IS NULL THEN
    INSERT INTO tbUsuarios (strNombre, strCorreo,intRol,strTipo_Accion,datFecha_Alta)
    VALUES (p_strNombre, p_strCorreo,3,'REGISTRO',NOW());
   
  ELSE
	  UPDATE tbUsuarios
	  SET strTipo_Accion = 'LOGIN'
	  WHERE strCorreo = p_strCorreo;
  END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-25 17:35:08
