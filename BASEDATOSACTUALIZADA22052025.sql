-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dbmedical
-- ------------------------------------------------------
-- Server version	5.7.44-log

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
  `intCita` int(11) NOT NULL AUTO_INCREMENT,
  `strNombrePaciente` varchar(100) NOT NULL,
  `intEdad` int(11) NOT NULL,
  `strGenero` varchar(100) NOT NULL,
  `strCorreoPaciente` varchar(100) DEFAULT NULL,
  `strTelefonoPaciente` varchar(20) DEFAULT NULL,
  `idEspecialidad` int(11) NOT NULL,
  `intDoctor` int(11) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbcitas`
--

LOCK TABLES `tbcitas` WRITE;
/*!40000 ALTER TABLE `tbcitas` DISABLE KEYS */;
INSERT INTO `tbcitas` VALUES (1,'Josue Flores',26,'Masculino','josuecumtual@gmail.com','5584893998',2,2,'2025-05-22','22:00','pagado',500.00,'DM-00001','Prueba','2025-05-22 08:41:02','2025-05-22 09:47:23','Efectivo'),(2,'Carolina Vallejo',27,'Femenino','carolinavrsm@gmail.com','8334749560',3,3,'2025-05-22','12:00','pagado',500.00,'DG-00001','Prueba','2025-05-22 10:33:57','2025-05-22 10:34:50','Efectivo');
/*!40000 ALTER TABLE `tbcitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbdoctores`
--

DROP TABLE IF EXISTS `tbdoctores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbdoctores` (
  `intDoctor` int(11) NOT NULL AUTO_INCREMENT,
  `strNombreDoctor` varchar(100) NOT NULL,
  `strCorreoDoctor` varchar(100) DEFAULT NULL,
  `strTelefonoDoctor` varchar(20) DEFAULT NULL,
  `strMatriculaDoctor` varchar(120) DEFAULT NULL,
  `intEspecialidad` int(11) NOT NULL,
  `datFechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intDoctor`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbdoctores`
--

LOCK TABLES `tbdoctores` WRITE;
/*!40000 ALTER TABLE `tbdoctores` DISABLE KEYS */;
INSERT INTO `tbdoctores` VALUES (1,'Dra. Laura Pérez','laura.perez@clinica.com','555-1000','MTR-001',1,'2025-05-21 16:06:04'),(2,'Dr. Andrés Martínez','andres.martinez@clinica.com','555-2000','MTR-002',2,'2025-05-21 16:06:04'),(3,'Dra. Sofía Gómez','sofia.gomez@clinica.com','555-3000','MTR-003',3,'2025-05-21 16:06:04'),(4,'Dr. Rodrigo Díaz','rodrigo.diaz@clinica.com','555-4000','MTR-004',4,'2025-05-21 16:06:04'),(5,'Dr. Luis Herrera','luis.herrera@clinica.com','555-5000','MTR-005',5,'2025-05-21 16:06:04'),(6,'Dra. Camila Torres','camila.torres@clinica.com','555-6000','MTR-006',6,'2025-05-21 16:06:04'),(7,'Dr. Javier Morales','javier.morales@clinica.com','555-7000','MTR-007',7,'2025-05-21 16:06:04');
/*!40000 ALTER TABLE `tbdoctores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbespecialidades`
--

DROP TABLE IF EXISTS `tbespecialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbespecialidades` (
  `idEspecialidad` int(11) NOT NULL AUTO_INCREMENT,
  `strNombreEspecialidad` varchar(100) NOT NULL,
  `strDescripcion` varchar(100) DEFAULT NULL,
  `intEstatus` int(11) DEFAULT NULL,
  `datFechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idEspecialidad`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
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
-- Table structure for table `tblogs_accesos`
--

DROP TABLE IF EXISTS `tblogs_accesos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblogs_accesos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `strUsuario_Email` varchar(255) NOT NULL,
  `tipo` enum('login','registro') NOT NULL,
  `strNombre` varchar(255) DEFAULT NULL,
  `strIp` varchar(45) DEFAULT NULL,
  `strUbicacion` varchar(255) DEFAULT NULL,
  `datFecha` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblogs_accesos`
--

LOCK TABLES `tblogs_accesos` WRITE;
/*!40000 ALTER TABLE `tblogs_accesos` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblogs_accesos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbroles`
--

DROP TABLE IF EXISTS `tbroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbroles` (
  `intRol` int(11) NOT NULL AUTO_INCREMENT,
  `strRol` varchar(255) DEFAULT NULL,
  `intEstatus` int(11) DEFAULT NULL,
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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `strNombre` varchar(255) DEFAULT NULL,
  `strTelefono` varchar(50) DEFAULT NULL,
  `strCorreo` varchar(255) NOT NULL,
  `intRol` int(11) DEFAULT NULL,
  `strTipo_Accion` varchar(50) DEFAULT NULL,
  `datFecha_Alta` datetime DEFAULT NULL,
  `strUsuario` varchar(100) DEFAULT NULL,
  `strContra` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `strCorreo` (`strCorreo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbusuarios`
--

LOCK TABLES `tbusuarios` WRITE;
/*!40000 ALTER TABLE `tbusuarios` DISABLE KEYS */;
INSERT INTO `tbusuarios` VALUES (1,'Josue Flores','5584893998','mkt.esymbel2025@gmail.com',1,'LOGIN','2025-05-07 00:00:00','admin','$2b$10$FP/yELvQUwuvcMMrX/rGt.ygygJDBh.kO/8woFsfTP1vDlAElCIVO'),(2,'Josue Flores',NULL,'josuecumtual2024@gmail.com',3,'LOGIN','2025-05-08 12:11:09',NULL,NULL);
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
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbCitas_Get_Cita`(
IN sp_strFolio VARCHAR(100)
)
BEGIN
	SELECT 
    c.strNombrePaciente,
    CAST(c.datFecha AS DATE) datFecha,
    c.intHora,
    d.strNombreDoctor,
    UPPER(c.strEstatusPago) strEstatusPago,
    e.strNombreEspecialidad,
    c.dblTotal,
    c.strMetodoPago
    FROM tbCitas c
    INNER JOIN tbDoctores d ON d.intDoctor = c.intDoctor
    INNER JOIN tbEspecialidades e ON e.idEspecialidad = c.idEspecialidad
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
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbCitas_List`()
BEGIN
	SELECT 
    c.strNombrePaciente,
    CAST(c.datFecha AS DATE) datFecha,
    c.intHora,
    d.strNombreDoctor,
    UPPER(c.strEstatusPago) strEstatusPago,
    e.strNombreEspecialidad
    FROM tbCitas c
    INNER JOIN tbDoctores d ON d.intDoctor = c.intDoctor
    INNER JOIN tbEspecialidades e ON e.idEspecialidad = c.idEspecialidad;
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
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
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
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
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
/*!50003 DROP PROCEDURE IF EXISTS `sp_tbEspecialidades_Get` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
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
/*!50003 DROP PROCEDURE IF EXISTS `sp_tbLogs_Accesos_Save` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbLogs_Accesos_Save`(
  IN p_strCorreo VARCHAR(255),
  IN p_tipo VARCHAR(10),
  IN p_strNombre VARCHAR(255),
  IN p_strIp VARCHAR(45),
  IN p_strUbicacion VARCHAR(255)
  )
BEGIN
	 INSERT INTO tbLogs_accesos (strUsuario_Email, tipo, strNombre, strIp, strUbicacion,datFecha)
	 VALUES (p_strCorreo, p_tipo, p_strNombre, p_strIp, p_strUbicacion,NOW());
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tbUsuarios_Login` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbUsuarios_Login`(
  IN p_strCorreo VARCHAR(255),
  IN p_strNombre VARCHAR(255),
  OUT p_strEstatus VARCHAR(20)
  )
BEGIN

  DECLARE v_id INT;

  SELECT id INTO v_id FROM tbUsuarios WHERE strCorreo = p_strCorreo;

  IF v_id IS NULL THEN
    INSERT INTO tbUsuarios (strNombre, strCorreo,intRol,strTipo_Accion,datFecha_Alta)
    VALUES (p_strNombre, p_strCorreo,3,'REGISTRO',NOW());
   SET p_strEstatus = 'NO_EXISTE';
  ELSE
	  SET p_strEstatus = 'EXISTE';
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
/*!50003 DROP PROCEDURE IF EXISTS `sp_ValidarLoginUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
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
    intRol
  FROM tbUsuarios
  WHERE strCorreo = p_identificador OR strUsuario = p_identificador;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tbCitas_List` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tbCitas_List`()
BEGIN
	SELECT *
    FROM tbCitas;
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
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
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

-- Dump completed on 2025-05-22 16:38:20
