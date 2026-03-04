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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbcitas`
--

LOCK TABLES `tbcitas` WRITE;
/*!40000 ALTER TABLE `tbcitas` DISABLE KEYS */;
INSERT INTO `tbcitas` VALUES (1,'Josue Flores',26,'Masculino','josuecumtual2024@gmail.com','5584893998',1,1,'2025-05-23','15:00','pagado',500.00,'DP-00001','Prueba','2025-05-23 12:24:30','2026-03-02 15:49:02','Efectivo',1,'CONFIRMADA'),(2,'Sarai Flores Galindo',24,'Femenino','sara@gmail.com','55848939898',1,1,'2026-03-03','17:32','pagado',500.00,'CV-00002','Congestion nasal','2026-03-03 10:51:11','2026-03-03 17:47:34','PENDIENTE',2,'FINALIZADA');
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
  PRIMARY KEY (`intDoctor`),
  UNIQUE KEY `strEmail` (`strEmail`),
  UNIQUE KEY `strUsuario` (`strUsuario`),
  KEY `intEspecialidad` (`intEspecialidad`),
  CONSTRAINT `tbdoctores_ibfk_1` FOREIGN KEY (`intEspecialidad`) REFERENCES `tbespecialidades` (`intEspecialidad`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbdoctores`
--

LOCK TABLES `tbdoctores` WRITE;
/*!40000 ALTER TABLE `tbdoctores` DISABLE KEYS */;
INSERT INTO `tbdoctores` VALUES (1,'Carolina','Vallejo','1998-05-11','femenino','San Luis Potosí','Rioverde','','8334749560','carolina@gmail.com','2026-02-26 13:03:05',1,'12345678798','123sl',600.00,'1','Medicina General','carolina','$2b$10$XEJG9kEd2ykEtIfZnQ3ZoOCxHGzJlOh2mw0kkoqn8zbaiZ4IKrs5q','doctor','activo');
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbdoctores_horarios`
--

LOCK TABLES `tbdoctores_horarios` WRITE;
/*!40000 ALTER TABLE `tbdoctores_horarios` DISABLE KEYS */;
INSERT INTO `tbdoctores_horarios` VALUES (1,1,'20:05:00','19:30:00','Lunes,Martes,Jueves,Viernes','2026-02-26 13:05:30','2026-02-26 13:05:30');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbpacientes`
--

LOCK TABLES `tbpacientes` WRITE;
/*!40000 ALTER TABLE `tbpacientes` DISABLE KEYS */;
INSERT INTO `tbpacientes` VALUES (1,'Josue','Flores','Galindo','MASCULINO','1999-01-13',NULL,'5584893998',NULL,'josue@gmail.com','San Eduardo','Guadalupe','Nuevo Leon','67125',NULL,NULL,NULL,NULL,'ACTIVO','2026-02-25 16:45:07','2026-02-25 16:45:49',NULL,0),(2,'Sarai Flores Galindo',NULL,NULL,'FEMENINO','2002-03-03',NULL,'55848939898',NULL,'sara@gmail.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ACTIVO','2026-03-03 10:51:11','2026-03-03 10:51:11',NULL,0);
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-03 17:48:50
