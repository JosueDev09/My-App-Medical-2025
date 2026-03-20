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
  `intEspecialidad` int NOT NULL,
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
  `intPaciente` int DEFAULT NULL,
  `strEstatusCita` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`intCita`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbcitas`
--

LOCK TABLES `tbcitas` WRITE;
/*!40000 ALTER TABLE `tbcitas` DISABLE KEYS */;
INSERT INTO `tbcitas` VALUES (1,'Josue Flores',27,'Masculino','josue@gmail.com','5584893998',1,1,'2026-03-19','10:30','pagado',800.00,'CR-00001','Congestion Nasas','2026-03-19 10:24:24','2026-03-19 11:21:20','EFECTIVO',1,'FINALIZADA'),(2,'Josue Flores',27,'MASCULINO','josue@gmail.com','5584893998',1,1,'2026-03-19','12:50','pendiente',800.00,'CR-00002','Temperatura','2026-03-19 12:46:39','2026-03-19 12:46:39','PENDIENTE',1,'PENDIENTE'),(3,'Sarai Flores',25,'Femenino','sarai@gmail.com','2711233441',1,1,'2026-03-19','13:00','pendiente',800.00,'CR-00003','Seguimiento de terapias','2026-03-19 12:59:11','2026-03-19 12:59:11','PENDIENTE',2,'PENDIENTE');
/*!40000 ALTER TABLE `tbcitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbciudades`
--

DROP TABLE IF EXISTS `tbciudades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbciudades` (
  `intCiudad` int NOT NULL AUTO_INCREMENT,
  `intEstado` int NOT NULL,
  `strNombre` varchar(150) NOT NULL,
  `datFechaRegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intCiudad`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbciudades`
--

LOCK TABLES `tbciudades` WRITE;
/*!40000 ALTER TABLE `tbciudades` DISABLE KEYS */;
INSERT INTO `tbciudades` VALUES (1,19,'Monterrey','2026-02-26 10:39:03'),(2,19,'Guadalupe','2026-02-26 10:39:03'),(3,19,'San Nicolás de los Garza','2026-02-26 10:39:03'),(4,19,'Apodaca','2026-02-26 10:39:03'),(5,19,'San Pedro Garza García','2026-02-26 10:39:03'),(6,19,'Santa Catarina','2026-02-26 10:39:03'),(7,15,'Guadalajara','2026-02-26 10:39:03'),(8,15,'Zapopan','2026-02-26 10:39:03'),(9,15,'Tlaquepaque','2026-02-26 10:39:03'),(10,15,'Tonalá','2026-02-26 10:39:03'),(11,15,'Puerto Vallarta','2026-02-26 10:39:03'),(12,7,'Ciudad de México','2026-02-26 10:39:03'),(13,11,'Toluca','2026-02-26 10:39:03'),(14,11,'Ecatepec de Morelos','2026-02-26 10:39:03'),(15,11,'Naucalpan de Juárez','2026-02-26 10:39:03'),(16,11,'Tlalnepantla de Baz','2026-02-26 10:39:03'),(17,11,'Nezahualcóyotl','2026-02-26 10:39:03'),(18,12,'León','2026-02-26 10:39:03'),(19,12,'Irapuato','2026-02-26 10:39:03'),(20,12,'Celaya','2026-02-26 10:39:03'),(21,12,'Salamanca','2026-02-26 10:39:03'),(22,21,'Puebla','2026-02-26 10:39:03'),(23,21,'Tehuacán','2026-02-26 10:39:03'),(24,21,'Atlixco','2026-02-26 10:39:03'),(25,22,'Querétaro','2026-02-26 10:39:03'),(26,22,'San Juan del Río','2026-02-26 10:39:03'),(27,22,'El Marqués','2026-02-26 10:39:03'),(28,23,'Cancún','2026-02-26 10:39:03'),(29,23,'Playa del Carmen','2026-02-26 10:39:03'),(30,23,'Chetumal','2026-02-26 10:39:03'),(31,23,'Tulum','2026-02-26 10:39:03'),(32,30,'Veracruz','2026-02-26 10:39:03'),(33,30,'Xalapa','2026-02-26 10:39:03'),(34,30,'Córdoba','2026-02-26 10:39:03'),(35,30,'Poza Rica','2026-02-26 10:39:03'),(36,31,'Mérida','2026-02-26 10:39:03'),(37,31,'Valladolid','2026-02-26 10:39:03'),(38,2,'Tijuana','2026-02-26 10:39:03'),(39,2,'Mexicali','2026-02-26 10:39:03'),(40,2,'Ensenada','2026-02-26 10:39:03'),(41,28,'Reynosa','2026-02-26 10:54:16'),(42,28,'Matamoros','2026-02-26 10:54:16'),(43,28,'Nuevo Laredo','2026-02-26 10:54:16'),(44,28,'Tampico','2026-02-26 10:54:16'),(45,28,'Ciudad Victoria','2026-02-26 10:54:16'),(46,28,'Altamira','2026-02-26 10:54:16'),(47,24,'San Luis Potosí','2026-02-26 10:54:25'),(48,24,'Soledad de Graciano Sánchez','2026-02-26 10:54:25'),(49,24,'Ciudad Valles','2026-02-26 10:54:25'),(50,24,'Matehuala','2026-02-26 10:54:25'),(51,24,'Rioverde','2026-02-26 10:54:25');
/*!40000 ALTER TABLE `tbciudades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbconsultas`
--

DROP TABLE IF EXISTS `tbconsultas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbconsultas` (
  `intConsulta` int NOT NULL AUTO_INCREMENT,
  `intPaciente` int NOT NULL,
  `intCita` int DEFAULT NULL,
  `intDoctor` int NOT NULL,
  `datFechaConsulta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `strMotivoConsulta` varchar(255) NOT NULL,
  `strPadecimientoActual` text,
  `strExploracionFisica` text,
  `strNotasConsulta` text,
  `strDiagnostico` text,
  `strTratamiento` text,
  `strIndicaciones` text,
  `strPronostico` text,
  `datProximaConsulta` datetime DEFAULT NULL,
  `strEstatusConsulta` enum('ABIERTA','FINALIZADA','CANCELADA') DEFAULT 'ABIERTA',
  `datFechaRegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `datFechaActualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isEliminado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`intConsulta`),
  KEY `idx_paciente` (`intPaciente`),
  KEY `idx_doctor` (`intDoctor`),
  KEY `idx_cita` (`intCita`),
  KEY `idx_fecha` (`datFechaConsulta`),
  CONSTRAINT `fk_tbConsultas_Cita` FOREIGN KEY (`intCita`) REFERENCES `tbcitas` (`intCita`),
  CONSTRAINT `fk_tbConsultas_Doctor` FOREIGN KEY (`intDoctor`) REFERENCES `tbdoctores` (`intDoctor`),
  CONSTRAINT `fk_tbConsultas_Paciente` FOREIGN KEY (`intPaciente`) REFERENCES `tbpacientes` (`intPaciente`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbconsultas`
--

LOCK TABLES `tbconsultas` WRITE;
/*!40000 ALTER TABLE `tbconsultas` DISABLE KEYS */;
INSERT INTO `tbconsultas` VALUES (1,1,1,1,'2026-03-19 10:29:56','Congestion Nasas','Congestion Nasal','N/A','Congestion Nasal','Congestion Nasal','Antifluidez','Cuidarse','Normal',NULL,'FINALIZADA','2026-03-19 10:29:56','2026-03-19 10:29:56',0);
/*!40000 ALTER TABLE `tbconsultas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbconsultasignosvitales`
--

DROP TABLE IF EXISTS `tbconsultasignosvitales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbconsultasignosvitales` (
  `intSignoVital` int NOT NULL AUTO_INCREMENT,
  `intConsulta` int NOT NULL,
  `dblPeso` decimal(10,2) DEFAULT NULL COMMENT 'Peso en kilogramos',
  `dblTalla` decimal(10,2) DEFAULT NULL COMMENT 'Talla en metros',
  `dblIMC` decimal(10,2) DEFAULT NULL COMMENT 'Índice de Masa Corporal calculado',
  `strPresionArterial` varchar(20) DEFAULT NULL COMMENT 'Presión arterial (ej: 120/80)',
  `intFrecuenciaCardiaca` int DEFAULT NULL COMMENT 'Frecuencia cardíaca en latidos por minuto',
  `intFrecuenciaRespiratoria` int DEFAULT NULL COMMENT 'Frecuencia respiratoria en respiraciones por minuto',
  `dblTemperatura` decimal(10,2) DEFAULT NULL COMMENT 'Temperatura corporal en grados Celsius',
  `dblGlucosa` decimal(10,2) DEFAULT NULL COMMENT 'Nivel de glucosa en mg/dL',
  `dblSaturacionOxigeno` decimal(10,2) DEFAULT NULL COMMENT 'Saturación de oxígeno en porcentaje',
  `datFechaRegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intSignoVital`),
  KEY `idx_consulta` (`intConsulta`),
  CONSTRAINT `fk_tbConsultaSignosVitales_Consulta` FOREIGN KEY (`intConsulta`) REFERENCES `tbconsultas` (`intConsulta`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbconsultasignosvitales`
--

LOCK TABLES `tbconsultasignosvitales` WRITE;
/*!40000 ALTER TABLE `tbconsultasignosvitales` DISABLE KEYS */;
INSERT INTO `tbconsultasignosvitales` VALUES (1,1,90.00,1.78,28.41,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-19 10:29:56');
/*!40000 ALTER TABLE `tbconsultasignosvitales` ENABLE KEYS */;
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
  `datFechaNacimiento` date DEFAULT NULL,
  `strSexo` varchar(10) DEFAULT NULL,
  `strEstado` varchar(100) DEFAULT NULL,
  `strCiudad` varchar(100) DEFAULT NULL,
  `strDireccion` varchar(255) DEFAULT NULL,
  `strTelefono` varchar(20) DEFAULT NULL,
  `strEmail` varchar(100) DEFAULT NULL,
  `datFechaRegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `intEspecialidad` int DEFAULT NULL,
  `strCedulaProfesional` varchar(50) DEFAULT NULL,
  `strCurpRFC` varchar(50) DEFAULT NULL,
  `dblPrecioConsulta` decimal(10,2) DEFAULT NULL,
  `strConsultorio` varchar(255) DEFAULT NULL,
  `strDescripcionDoctor` text,
  `strUsuario` varchar(100) DEFAULT NULL,
  `strPassword` varchar(255) DEFAULT NULL,
  `strRol` varchar(50) DEFAULT 'Doctor',
  `strEstadoUsuario` varchar(20) DEFAULT 'Activo',
  `intUsuario` int DEFAULT NULL,
  PRIMARY KEY (`intDoctor`),
  UNIQUE KEY `strEmail` (`strEmail`),
  UNIQUE KEY `strUsuario` (`strUsuario`),
  UNIQUE KEY `uq_doctor_usuario` (`intUsuario`),
  KEY `intEspecialidad` (`intEspecialidad`),
  CONSTRAINT `tbdoctores_ibfk_1` FOREIGN KEY (`intEspecialidad`) REFERENCES `tbespecialidades` (`intEspecialidad`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbdoctores`
--

LOCK TABLES `tbdoctores` WRITE;
/*!40000 ALTER TABLE `tbdoctores` DISABLE KEYS */;
INSERT INTO `tbdoctores` VALUES (1,'Carolina','Vallejo Ramos','1998-05-11','masculino','San Luis Potosí','Rioverde','','8334749560','esymbel.mkt2025@gmail.com','2026-03-04 16:24:16',1,'CVR11051998','CVR11051998',800.00,'1','MEDICO GENERAL',NULL,NULL,'Doctor','Activo',5),(2,'Monica','Galindo Tress','1970-01-27','femenino','Veracruz','Córdoba','','2711959808','monica@gmail.com','2026-03-09 11:09:03',2,'MON271970','MON271970',800.00,'2','Pediatra',NULL,NULL,'Doctor','Activo',6);
/*!40000 ALTER TABLE `tbdoctores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbdoctores_horarios`
--

DROP TABLE IF EXISTS `tbdoctores_horarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbdoctores_horarios` (
  `intHorario` int NOT NULL AUTO_INCREMENT,
  `intDoctor` int NOT NULL,
  `horarioInicio` time NOT NULL,
  `horarioFin` time NOT NULL,
  `diasDisponibles` varchar(255) NOT NULL COMMENT 'Días separados por comas: Lunes,Martes,Miércoles',
  `datFechaCreacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `datFechaModificacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`intHorario`),
  KEY `idx_doctor` (`intDoctor`),
  CONSTRAINT `tbdoctores_horarios_ibfk_1` FOREIGN KEY (`intDoctor`) REFERENCES `tbdoctores` (`intDoctor`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbdoctores_horarios`
--

LOCK TABLES `tbdoctores_horarios` WRITE;
/*!40000 ALTER TABLE `tbdoctores_horarios` DISABLE KEYS */;
INSERT INTO `tbdoctores_horarios` VALUES (1,1,'08:00:00','19:30:00','Lunes,Martes,Miércoles,Jueves','2026-03-04 16:24:51','2026-03-04 16:24:51'),(2,2,'07:30:00','20:00:00','Lunes,Martes,Miércoles,Jueves,Viernes,Sábado','2026-03-09 11:09:54','2026-03-09 11:09:54');
/*!40000 ALTER TABLE `tbdoctores_horarios` ENABLE KEYS */;
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
-- Table structure for table `tbestados`
--

DROP TABLE IF EXISTS `tbestados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbestados` (
  `intEstado` int NOT NULL AUTO_INCREMENT,
  `strNombre` varchar(100) NOT NULL,
  `strClave` varchar(10) DEFAULT NULL,
  `datFechaRegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intEstado`),
  UNIQUE KEY `strNombre` (`strNombre`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbestados`
--

LOCK TABLES `tbestados` WRITE;
/*!40000 ALTER TABLE `tbestados` DISABLE KEYS */;
INSERT INTO `tbestados` VALUES (1,'Aguascalientes','AGS','2026-02-26 10:31:34'),(2,'Baja California','BC','2026-02-26 10:31:34'),(3,'Baja California Sur','BCS','2026-02-26 10:31:34'),(4,'Campeche','CAM','2026-02-26 10:31:34'),(5,'Chiapas','CHIS','2026-02-26 10:31:34'),(6,'Chihuahua','CHIH','2026-02-26 10:31:34'),(7,'Ciudad de México','CDMX','2026-02-26 10:31:34'),(8,'Coahuila','COAH','2026-02-26 10:31:34'),(9,'Colima','COL','2026-02-26 10:31:34'),(10,'Durango','DGO','2026-02-26 10:31:34'),(11,'Estado de México','EDOMEX','2026-02-26 10:31:34'),(12,'Guanajuato','GTO','2026-02-26 10:31:34'),(13,'Guerrero','GRO','2026-02-26 10:31:34'),(14,'Hidalgo','HGO','2026-02-26 10:31:34'),(15,'Jalisco','JAL','2026-02-26 10:31:34'),(16,'Michoacán','MICH','2026-02-26 10:31:34'),(17,'Morelos','MOR','2026-02-26 10:31:34'),(18,'Nayarit','NAY','2026-02-26 10:31:34'),(19,'Nuevo León','NL','2026-02-26 10:31:34'),(20,'Oaxaca','OAX','2026-02-26 10:31:34'),(21,'Puebla','PUE','2026-02-26 10:31:34'),(22,'Querétaro','QRO','2026-02-26 10:31:34'),(23,'Quintana Roo','QROO','2026-02-26 10:31:34'),(24,'San Luis Potosí','SLP','2026-02-26 10:31:34'),(25,'Sinaloa','SIN','2026-02-26 10:31:34'),(26,'Sonora','SON','2026-02-26 10:31:34'),(27,'Tabasco','TAB','2026-02-26 10:31:34'),(28,'Tamaulipas','TAMPS','2026-02-26 10:31:34'),(29,'Tlaxcala','TLAX','2026-02-26 10:31:34'),(30,'Veracruz','VER','2026-02-26 10:31:34'),(31,'Yucatán','YUC','2026-02-26 10:31:34'),(32,'Zacatecas','ZAC','2026-02-26 10:31:34');
/*!40000 ALTER TABLE `tbestados` ENABLE KEYS */;
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
  `strGenero` enum('MASCULINO','FEMENINO','OTRO') DEFAULT 'OTRO',
  `datFechaNacimiento` date NOT NULL,
  `intEdad` int NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbpacientes`
--

LOCK TABLES `tbpacientes` WRITE;
/*!40000 ALTER TABLE `tbpacientes` DISABLE KEYS */;
INSERT INTO `tbpacientes` VALUES (1,'Josue Flores','MASCULINO','1999-03-19',27,NULL,'5584893998',NULL,'josue@gmail.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ACTIVO','2026-03-19 10:24:24','2026-03-19 10:24:24',NULL,0),(2,'Sarai Flores','FEMENINO','2001-03-19',25,NULL,'2711233441',NULL,'sarai@gmail.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ACTIVO','2026-03-19 12:59:11','2026-03-19 12:59:11',NULL,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbusuarios`
--

LOCK TABLES `tbusuarios` WRITE;
/*!40000 ALTER TABLE `tbusuarios` DISABLE KEYS */;
INSERT INTO `tbusuarios` VALUES (1,'Josue Flores','5584893998','mkt.esymbel2025@gmail.com',1,'LOGIN','2025-05-07 00:00:00','admin','$2b$10$FP/yELvQUwuvcMMrX/rGt.ygygJDBh.kO/8woFsfTP1vDlAElCIVO',1),(5,'Carolina Vallejo Ramos','8334749560','esymbel.mkt2025@gmail.com',4,'activo','2026-03-04 16:25:06','dracarolina','$2b$10$/eGdBntmxpn9lUcj6gbbOOGfM5hgRwBOE0I0Wu19FNLPAm5N9QwZ6',1),(6,'Monica Galindo Tress','2711959808','monica@gmail.com',4,'activo','2026-03-09 11:10:11','dramonica','$2b$10$R6tO0G7aug/mZuNEWAGzM.1jXEY3Kyf2hplHY/zEAbE8E.9G2qbK6',1);
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
    CONCAT(IFNULL(d.strNombre,''),' ',IFNULL(d.strApellidos,'')) AS strNombreDoctor,
    UPPER(c.strEstatusPago) strEstatusPago,
    e.strNombreEspecialidad,
    c.dblTotal,
    c.strMetodoPago,
    c.strGenero,
    c.strTelefonoPaciente,
	c.strCorreoPaciente,
    c.strMotivo,
    c.intEdad,
    c.strEstatusPago,
    d.dblPrecioConsulta
    FROM tbCitas c
    INNER JOIN tbDoctores d ON d.intDoctor = c.intDoctor
    INNER JOIN tbEspecialidades e ON e.intEspecialidad = c.intEspecialidad
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
     d.strApellidos,
    UPPER(c.strEstatusPago) strEstatusPago,
    e.strNombreEspecialidad,
    c.strEstatusPago,
    c.strEstatusCita
    FROM tbCitas c
    INNER JOIN tbDoctores d ON d.intDoctor = c.intDoctor
    INNER JOIN tbEspecialidades e ON e.intEspecialidad = c.intEspecialidad;
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
    d.strNombre,
    UPPER(c.strEstatusPago) AS strEstatusPago,
    e.strNombreEspecialidad,
    c.strEstatusPago
  FROM tbCitas c
  INNER JOIN tbDoctores d ON d.intDoctor = c.intDoctor
  INNER JOIN tbEspecialidades e ON e.intEspecialidad = c.intEspecialidad
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
  DECLARE vNombreDoctor VARCHAR(200);
  DECLARE vPrecioConsulta DECIMAL(18,2);

  DECLARE vIntPaciente INT;
  DECLARE vFechaNacimiento DATE;

  -- 1) Obtener nombre completo del doctor (ojo: tu SELECT original era incorrecto)
  SELECT CONCAT(IFNULL(strNombre,''),' ',IFNULL(strApellidos,'')) INTO vNombreDoctor
  FROM tbDoctores
  WHERE intDoctor = sp_intDoctor
  LIMIT 1;
  
  SELECT dblPrecioConsulta INTO vPrecioConsulta
  FROM tbDoctores
   WHERE intDoctor = sp_intDoctor
   LIMIT 1;

  -- 2) Generar iniciales del doctor
  SET vInicialesDoctor = UPPER(
    CONCAT(
      LEFT(SUBSTRING_INDEX(TRIM(vNombreDoctor), ' ', 1), 1),
      IF(LOCATE(' ', TRIM(vNombreDoctor)) > 0, LEFT(SUBSTRING_INDEX(TRIM(vNombreDoctor), ' ', -1), 1), '')
    )
  );

  -- 3) Consecutivo por doctor
  SELECT COUNT(*) + 1 INTO vConsecutivo
  FROM tbCitas
  WHERE intDoctor = sp_intDoctor;

  SET vFolioGenerado = CONCAT(vInicialesDoctor, '-', LPAD(vConsecutivo, 5, '0'));

  -- 4) Buscar paciente (primero por email si viene)
  SET vIntPaciente = NULL;

  IF sp_strCorreoPaciente IS NOT NULL AND TRIM(sp_strCorreoPaciente) <> '' THEN
    SELECT intPaciente INTO vIntPaciente
    FROM tbpacientes
    WHERE isEliminado = 0
      AND strEmail = sp_strCorreoPaciente
    LIMIT 1;
  END IF;

  -- Si no se encontró por email, buscar por teléfono
  IF vIntPaciente IS NULL THEN
    SELECT intPaciente INTO vIntPaciente
    FROM tbpacientes
    WHERE isEliminado = 0
      AND strTelefono = sp_strTelefonoPaciente
    LIMIT 1;
  END IF;

  -- 5) Si no existe, crearlo
  IF vIntPaciente IS NULL THEN
    -- calcular fecha nacimiento aproximada desde edad (si edad viene)
    -- (si no quieres aproximar, pon una fecha default o vuelve datFechaNacimiento NULL y cambia la tabla)
    IF sp_intEdad IS NULL OR sp_intEdad <= 0 THEN
      SET vFechaNacimiento = DATE_SUB(CURDATE(), INTERVAL 18 YEAR);
    ELSE
      SET vFechaNacimiento = DATE_SUB(CURDATE(), INTERVAL sp_intEdad YEAR);
    END IF;

    INSERT INTO tbpacientes (
      strNombre,
      strGenero,
      datFechaNacimiento,
      intEdad,
      strTelefono,
      strEmail,
      strEstatus,
      isEliminado
    ) VALUES (
      sp_strNombrePaciente,
      CASE UPPER(TRIM(sp_strGenero))
        WHEN 'MASCULINO' THEN 'MASCULINO'
        WHEN 'FEMENINO'  THEN 'FEMENINO'
        ELSE 'OTRO'
      END,
      vFechaNacimiento,
      sp_intEdad,
      sp_strTelefonoPaciente,
      NULLIF(TRIM(sp_strCorreoPaciente),''),
      'ACTIVO',
      0
    );

    SET vIntPaciente = LAST_INSERT_ID();
  END IF;

  -- 6) Insertar cita (AHORA sí con intPaciente y strEstatusCita)
  INSERT INTO tbCitas(
    strNombrePaciente,
    intEdad,
    strGenero,
    strCorreoPaciente,
    strTelefonoPaciente,
    intEspecialidad,
    intDoctor,
    datFecha,
    intHora,
    strEstatusPago,
    dblTotal,
    strFolio,
    strMotivo,
    datFechaAlta,
    datFechaModificacion,
    strMetodoPago,
    intPaciente,
    strEstatusCita
  ) VALUES (
    sp_strNombrePaciente,
    sp_intEdad,
    sp_strGenero,
    sp_strCorreoPaciente,
    sp_strTelefonoPaciente,
    sp_idEspecialidad,
    sp_intDoctor,
    sp_datFecha,
    sp_intHora,
    'PENDIENTE',
    vPrecioConsulta,
    vFolioGenerado,
    sp_strMotivo,
    NOW(),
    NOW(),
    'PENDIENTE',
    vIntPaciente,
    'PENDIENTE'  -- o 'CONFIRMADA' si tu flujo lo requiere
  );

  -- 7) devolver la cita recién creada
  SELECT * FROM tbCitas WHERE strFolio = vFolioGenerado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tbDoctores_Datos_Profesionales_Save` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbDoctores_Datos_Profesionales_Save`(
    IN p_intDoctor INT,
    IN p_intEspecialidad INT,
    IN p_strCedulaProfesional VARCHAR(50),
    IN p_strCurpRFC VARCHAR(50),
    IN p_dblPrecioConsulta DECIMAL(10,2),
    IN p_strConsultorio VARCHAR(255),
    IN p_strDescripcionDoctor TEXT
)
BEGIN
    UPDATE tbdoctores 
    SET 
        intEspecialidad = p_intEspecialidad,
        strCedulaProfesional = p_strCedulaProfesional,
        strCurpRFC = p_strCurpRFC,
        dblPrecioConsulta = p_dblPrecioConsulta,
        strConsultorio = p_strConsultorio,
        strDescripcionDoctor = p_strDescripcionDoctor
    WHERE 
        intDoctor = p_intDoctor;
    
    SELECT ROW_COUNT() AS affected_rows;
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
    strNombre,
    strApellidos
    FROM tbDoctores
    WHERE intEspecialidad = sp_intEspecialidad;
    
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tbDoctores_Horarios_Save` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbDoctores_Horarios_Save`(
    IN p_intDoctor INT,
    IN p_horarioInicio TIME,
    IN p_horarioFin TIME,
    IN p_diasDisponibles VARCHAR(255)
)
BEGIN
    -- Eliminar horarios anteriores si existen
    DELETE FROM tbdoctores_horarios 
    WHERE intDoctor = p_intDoctor;
    
    -- Insertar nuevo horario
    INSERT INTO tbdoctores_horarios (
        intDoctor,
        horarioInicio,
        horarioFin,
        diasDisponibles,
        datFechaCreacion
    ) VALUES (
        p_intDoctor,
        p_horarioInicio,
        p_horarioFin,
        p_diasDisponibles,
        NOW()
    );
    
    SELECT LAST_INSERT_ID() AS intHorario;
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
    IN p_strNombre VARCHAR(100),
    IN p_strApellidos VARCHAR(100),
    IN p_datFechaNacimiento DATE,
    IN p_strSexo VARCHAR(10),
    IN p_strEstado VARCHAR(100),
    IN p_strCiudad VARCHAR(100),
    IN p_strDireccion VARCHAR(255),
    IN p_strTelefono VARCHAR(20),
    IN p_strEmail VARCHAR(100)
)
BEGIN
    INSERT INTO tbdoctores (
        strNombre,
        strApellidos,
        datFechaNacimiento,
        strSexo,
        strEstado,
        strCiudad,
        strDireccion,
        strTelefono,
        strEmail,
        datFechaRegistro
    ) VALUES (
        p_strNombre,
        p_strApellidos,
        p_datFechaNacimiento,
        p_strSexo,
        p_strEstado,
        p_strCiudad,
        p_strDireccion,
        p_strTelefono,
        p_strEmail,
        NOW()
    );
    
    SELECT LAST_INSERT_ID() AS intDoctor;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tbDoctores_Usuario_Save` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tbDoctores_Usuario_Save`(
    IN p_intDoctor INT,
    IN p_strUsuario VARCHAR(100),
    IN p_strPassword VARCHAR(255),
    IN p_strRol VARCHAR(50),
    IN p_strEstadoUsuario VARCHAR(20)
)
BEGIN
  DECLARE v_idUsuario INT DEFAULT NULL;
  DECLARE v_intRol INT;
  DECLARE v_strNombre varchar(100);
  DECLARE v_strCorreo varchar(100);
  DECLARE v_strTelefono varchar(100);
  DECLARE v_strApellidos varchar(100);
  
  SELECT intRol INTO v_intRol
  FROM tbroles
  WHERE strRol = p_strRol;

  -- Buscar usuario ya ligado a ese doctor (por tbdoctores.intUsuario)
  SELECT intUsuario INTO v_idUsuario
  FROM tbdoctores
  WHERE intDoctor = p_intDoctor
  LIMIT 1;
  
  SELECT strEmail INTO v_strCorreo
  FROM tbdoctores
  WHERE intDoctor = p_intDoctor
  LIMIT 1;
  
  SELECT strNombre INTO v_strNombre
  FROM tbdoctores
  WHERE intDoctor = p_intDoctor
  LIMIT 1;
  
   SELECT strApellidos INTO v_strApellidos
  FROM tbdoctores
  WHERE intDoctor = p_intDoctor
  LIMIT 1;
  
  SELECT strTelefono INTO v_strTelefono
  FROM tbdoctores
  WHERE intDoctor = p_intDoctor
  LIMIT 1;

  -- Si ya existe usuario, actualiza
  IF v_idUsuario IS NOT NULL THEN
    UPDATE tbusuarios
    SET
      strUsuario = p_strUsuario,
      strContra  = p_strPassword,
      intRol     = v_intRol,
      strTipo_Accion = p_strEstadoUsuario,
      datFecha_Alta = IFNULL(datFecha_Alta, NOW())
    WHERE id = v_idUsuario;

  -- Si no existe, inserta y liga
  ELSE
    INSERT INTO tbusuarios (
      strNombre,
      strTelefono,
      strCorreo,
      intRol,
      strTipo_Accion,
      datFecha_Alta,
      strUsuario,
      strContra,
      intEmpresa
    ) VALUES (
     CONCAT(v_strNombre,' ', v_strApellidos),
      v_strTelefono,
      v_strCorreo, -- ⚠️ si NO tienes correo aquí, esto evita romper UNIQUE
      v_intRol,
      p_strEstadoUsuario,
      NOW(),
      p_strUsuario,
      p_strPassword,
      1
    );

    SET v_idUsuario = LAST_INSERT_ID();

    UPDATE tbdoctores
    SET intUsuario = v_idUsuario
    WHERE intDoctor = p_intDoctor;
  END IF;

  SELECT v_idUsuario AS idUsuario;
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
    intEspecialidad,
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

-- Dump completed on 2026-03-20 16:58:13
