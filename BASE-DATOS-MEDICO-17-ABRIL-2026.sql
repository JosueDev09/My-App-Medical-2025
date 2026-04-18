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
-- Table structure for table `tbarchivosadjuntos`
--

DROP TABLE IF EXISTS `tbarchivosadjuntos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbarchivosadjuntos` (
  `intArchivo` int NOT NULL AUTO_INCREMENT,
  `intPaciente` int NOT NULL,
  `intDoctor` int DEFAULT NULL COMMENT 'Usuario que subió el archivo',
  `intConsulta` int DEFAULT NULL COMMENT 'Consulta relacionada (opcional)',
  `strNombreArchivo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `strRutaArchivo` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ruta en el servidor',
  `strTipoArchivo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'PDF, JPG, PNG, DOCX, etc',
  `dblTamanoArchivo` decimal(10,2) DEFAULT NULL COMMENT 'Tamaño en MB',
  `strCategoria` enum('ESTUDIO','CONSENTIMIENTO','IMAGEN','DOCUMENTO_LEGAL','RECETA','REFERENCIA','OTRO') COLLATE utf8mb4_unicode_ci DEFAULT 'OTRO',
  `txtDescripcion` text COLLATE utf8mb4_unicode_ci COMMENT 'Descripción del archivo',
  `txtNotas` text COLLATE utf8mb4_unicode_ci COMMENT 'Notas adicionales',
  `datFechaSubida` datetime DEFAULT CURRENT_TIMESTAMP,
  `isEliminado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`intArchivo`),
  KEY `fk_Archivos_Doctor` (`intDoctor`),
  KEY `fk_Archivos_Consulta` (`intConsulta`),
  KEY `idx_paciente` (`intPaciente`),
  KEY `idx_categoria` (`strCategoria`),
  KEY `idx_fecha` (`datFechaSubida`),
  KEY `idx_archivos_paciente_fecha` (`intPaciente`,`datFechaSubida` DESC),
  CONSTRAINT `fk_Archivos_Consulta` FOREIGN KEY (`intConsulta`) REFERENCES `tbconsultas` (`intConsulta`),
  CONSTRAINT `fk_Archivos_Doctor` FOREIGN KEY (`intDoctor`) REFERENCES `tbdoctores` (`intDoctor`),
  CONSTRAINT `fk_Archivos_Paciente` FOREIGN KEY (`intPaciente`) REFERENCES `tbpacientes` (`intPaciente`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbarchivosadjuntos`
--

LOCK TABLES `tbarchivosadjuntos` WRITE;
/*!40000 ALTER TABLE `tbarchivosadjuntos` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbarchivosadjuntos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbcatalogocie10`
--

DROP TABLE IF EXISTS `tbcatalogocie10`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbcatalogocie10` (
  `intCIE10` int NOT NULL AUTO_INCREMENT,
  `strCodigo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Código CIE-10 (ej: A00, E11.9)',
  `strDescripcion` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Descripción de la enfermedad',
  `strCategoria` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Categoría general (ej: Enfermedades infecciosas)',
  `strCapitulo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Capítulo CIE-10',
  `txtNotas` text COLLATE utf8mb4_unicode_ci COMMENT 'Notas adicionales o aclaraciones',
  `isActivo` tinyint(1) DEFAULT '1',
  `datFechaRegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intCIE10`),
  UNIQUE KEY `strCodigo` (`strCodigo`),
  UNIQUE KEY `unique_codigo` (`strCodigo`),
  KEY `idx_codigo` (`strCodigo`),
  KEY `idx_categoria` (`strCategoria`),
  KEY `idx_activo` (`isActivo`),
  KEY `idx_cie10_activo_codigo` (`isActivo`,`strCodigo`),
  FULLTEXT KEY `idx_descripcion` (`strDescripcion`,`strCategoria`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbcatalogocie10`
--

LOCK TABLES `tbcatalogocie10` WRITE;
/*!40000 ALTER TABLE `tbcatalogocie10` DISABLE KEYS */;
INSERT INTO `tbcatalogocie10` VALUES (1,'A00','Cólera','Enfermedades infecciosas intestinales','Cap I - Enfermedades infecciosas y parasitarias',NULL,1,'2026-04-16 10:50:43'),(2,'A09','Diarrea y gastroenteritis de presunto origen infeccioso','Enfermedades infecciosas intestinales','Cap I - Enfermedades infecciosas y parasitarias',NULL,1,'2026-04-16 10:50:43'),(3,'B34.9','Infección viral, no especificada','Infecciones virales','Cap I - Enfermedades infecciosas y parasitarias',NULL,1,'2026-04-16 10:50:43'),(4,'E10','Diabetes mellitus tipo 1','Diabetes mellitus','Cap IV - Enfermedades endocrinas, nutricionales y metabólicas',NULL,1,'2026-04-16 10:50:43'),(5,'E11','Diabetes mellitus tipo 2','Diabetes mellitus','Cap IV - Enfermedades endocrinas, nutricionales y metabólicas',NULL,1,'2026-04-16 10:50:43'),(6,'E11.9','Diabetes mellitus tipo 2 sin complicaciones','Diabetes mellitus','Cap IV - Enfermedades endocrinas, nutricionales y metabólicas',NULL,1,'2026-04-16 10:50:43'),(7,'E66.9','Obesidad, no especificada','Obesidad','Cap IV - Enfermedades endocrinas, nutricionales y metabólicas',NULL,1,'2026-04-16 10:50:43'),(8,'E78.5','Hiperlipidemia, no especificada','Trastornos del metabolismo de las lipoproteínas','Cap IV - Enfermedades endocrinas, nutricionales y metabólicas',NULL,1,'2026-04-16 10:50:43'),(9,'F32','Episodio depresivo','Trastornos del humor','Cap V - Trastornos mentales y del comportamiento',NULL,1,'2026-04-16 10:50:43'),(10,'F41.1','Trastorno de ansiedad generalizada','Trastornos de ansiedad','Cap V - Trastornos mentales y del comportamiento',NULL,1,'2026-04-16 10:50:43'),(11,'I10','Hipertensión arterial esencial (primaria)','Enfermedades hipertensivas','Cap IX - Enfermedades del sistema circulatorio',NULL,1,'2026-04-16 10:50:43'),(12,'I25.1','Enfermedad aterosclerótica del corazón','Cardiopatía isquémica crónica','Cap IX - Enfermedades del sistema circulatorio',NULL,1,'2026-04-16 10:50:43'),(13,'I50.9','Insuficiencia cardíaca, no especificada','Insuficiencia cardíaca','Cap IX - Enfermedades del sistema circulatorio',NULL,1,'2026-04-16 10:50:43'),(14,'J00','Rinofaringitis aguda (resfriado común)','Infecciones respiratorias agudas','Cap X - Enfermedades del sistema respiratorio',NULL,1,'2026-04-16 10:50:43'),(15,'J02.9','Faringitis aguda, no especificada','Infecciones respiratorias agudas','Cap X - Enfermedades del sistema respiratorio',NULL,1,'2026-04-16 10:50:43'),(16,'J03.9','Amigdalitis aguda, no especificada','Infecciones respiratorias agudas','Cap X - Enfermedades del sistema respiratorio',NULL,1,'2026-04-16 10:50:43'),(17,'J06.9','Infección aguda de las vías respiratorias superiores','Infecciones respiratorias agudas','Cap X - Enfermedades del sistema respiratorio',NULL,1,'2026-04-16 10:50:43'),(18,'J18.9','Neumonía, no especificada','Neumonía','Cap X - Enfermedades del sistema respiratorio',NULL,1,'2026-04-16 10:50:43'),(19,'J20.9','Bronquitis aguda, no especificada','Bronquitis','Cap X - Enfermedades del sistema respiratorio',NULL,1,'2026-04-16 10:50:43'),(20,'J45.9','Asma, no especificada','Asma','Cap X - Enfermedades del sistema respiratorio',NULL,1,'2026-04-16 10:50:43'),(21,'K21.9','Enfermedad por reflujo gastroesofágico sin esofagitis','Enfermedades del esófago','Cap XI - Enfermedades del sistema digestivo',NULL,1,'2026-04-16 10:50:43'),(22,'K29.7','Gastritis, no especificada','Gastritis y duodenitis','Cap XI - Enfermedades del sistema digestivo',NULL,1,'2026-04-16 10:50:43'),(23,'K30','Dispepsia funcional','Dispepsia','Cap XI - Enfermedades del sistema digestivo',NULL,1,'2026-04-16 10:50:43'),(24,'K59.0','Estreñimiento','Otros trastornos intestinales','Cap XI - Enfermedades del sistema digestivo',NULL,1,'2026-04-16 10:50:43'),(25,'L20.9','Dermatitis atópica, no especificada','Dermatitis y eczema','Cap XII - Enfermedades de la piel y del tejido subcutáneo',NULL,1,'2026-04-16 10:50:43'),(26,'L50.9','Urticaria, no especificada','Urticaria y eritema','Cap XII - Enfermedades de la piel y del tejido subcutáneo',NULL,1,'2026-04-16 10:50:43'),(27,'M25.5','Dolor en articulación','Otros trastornos articulares','Cap XIII - Enfermedades del sistema musculoesquelético',NULL,1,'2026-04-16 10:50:43'),(28,'M54.5','Dolor lumbar bajo','Dorsalgias','Cap XIII - Enfermedades del sistema musculoesquelético',NULL,1,'2026-04-16 10:50:43'),(29,'M79.1','Mialgia','Otros trastornos de los tejidos blandos','Cap XIII - Enfermedades del sistema musculoesquelético',NULL,1,'2026-04-16 10:50:43'),(30,'N39.0','Infección de vías urinarias, sitio no especificado','Infecciones urinarias','Cap XIV - Enfermedades del sistema genitourinario',NULL,1,'2026-04-16 10:50:43'),(31,'R05','Tos','Síntomas y signos respiratorios','Cap XVIII - Síntomas, signos y hallazgos anormales',NULL,1,'2026-04-16 10:50:43'),(32,'R06.0','Disnea','Síntomas y signos respiratorios','Cap XVIII - Síntomas, signos y hallazgos anormales',NULL,1,'2026-04-16 10:50:43'),(33,'R10.4','Otros dolores abdominales y los no especificados','Síntomas y signos digestivos','Cap XVIII - Síntomas, signos y hallazgos anormales',NULL,1,'2026-04-16 10:50:43'),(34,'R50.9','Fiebre, no especificada','Síntomas generales','Cap XVIII - Síntomas, signos y hallazgos anormales',NULL,1,'2026-04-16 10:50:43'),(35,'R51','Cefalea','Síntomas generales','Cap XVIII - Síntomas, signos y hallazgos anormales',NULL,1,'2026-04-16 10:50:43'),(36,'S06.0','Conmoción cerebral','Traumatismos de la cabeza','Cap XIX - Traumatismos, envenenamientos',NULL,1,'2026-04-16 10:50:43'),(37,'Z00.0','Examen médico general','Exámenes médicos','Cap XXI - Factores que influyen en el estado de salud',NULL,1,'2026-04-16 10:50:43'),(38,'Z01.8','Otros exámenes especiales especificados','Exámenes especiales','Cap XXI - Factores que influyen en el estado de salud',NULL,1,'2026-04-16 10:50:43'),(39,'Z23','Necesidad de inmunización contra enfermedad bacteriana única','Inmunizaciones','Cap XXI - Factores que influyen en el estado de salud',NULL,1,'2026-04-16 10:50:43');
/*!40000 ALTER TABLE `tbcatalogocie10` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `tbcitas` VALUES (1,'Josue Flores',27,'Masculino','josue@gmail.com','5584893998',1,1,'2026-03-19','10:30','pagado',800.00,'CR-00001','Congestion Nasas','2026-03-19 10:24:24','2026-03-19 11:21:20','EFECTIVO',1,'FINALIZADA'),(2,'Josue Flores',27,'MASCULINO','josue@gmail.com','5584893998',1,1,'2026-03-19','12:50','pagado',800.00,'CR-00002','Temperatura','2026-03-19 12:46:39','2026-03-30 09:08:39','EFECTIVO',1,'FINALIZADA'),(3,'Sarai Flores',25,'Femenino','sarai@gmail.com','2711233441',1,1,'2026-03-19','13:00','pagado',800.00,'CR-00003','Seguimiento de terapias','2026-03-19 12:59:11','2026-03-30 09:08:43','EFECTIVO',2,'FINALIZADA');
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
-- Table structure for table `tbconsultadiagnosticos`
--

DROP TABLE IF EXISTS `tbconsultadiagnosticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbconsultadiagnosticos` (
  `intConsultaDiagnostico` int NOT NULL AUTO_INCREMENT,
  `intConsulta` int NOT NULL,
  `intCIE10` int NOT NULL,
  `strTipoDiagnostico` enum('PRINCIPAL','SECUNDARIO','PRESUNTIVO','CONFIRMADO','COMORBILIDAD') COLLATE utf8mb4_unicode_ci DEFAULT 'PRINCIPAL' COMMENT 'Tipo de diagnóstico',
  `txtNotasDiagnostico` text COLLATE utf8mb4_unicode_ci COMMENT 'Notas adicionales del diagnóstico',
  `datFechaDiagnostico` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intConsultaDiagnostico`),
  KEY `idx_consulta` (`intConsulta`),
  KEY `idx_cie10` (`intCIE10`),
  KEY `idx_tipo` (`strTipoDiagnostico`),
  KEY `idx_consulta_diagnosticos_fecha` (`datFechaDiagnostico`),
  CONSTRAINT `fk_ConsultaDx_CIE10` FOREIGN KEY (`intCIE10`) REFERENCES `tbcatalogocie10` (`intCIE10`),
  CONSTRAINT `fk_ConsultaDx_Consulta` FOREIGN KEY (`intConsulta`) REFERENCES `tbconsultas` (`intConsulta`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbconsultadiagnosticos`
--

LOCK TABLES `tbconsultadiagnosticos` WRITE;
/*!40000 ALTER TABLE `tbconsultadiagnosticos` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbconsultadiagnosticos` ENABLE KEYS */;
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
  KEY `idx_consultas_paciente_fecha` (`intPaciente`,`datFechaConsulta` DESC),
  CONSTRAINT `fk_tbConsultas_Cita` FOREIGN KEY (`intCita`) REFERENCES `tbcitas` (`intCita`),
  CONSTRAINT `fk_tbConsultas_Doctor` FOREIGN KEY (`intDoctor`) REFERENCES `tbdoctores` (`intDoctor`),
  CONSTRAINT `fk_tbConsultas_Paciente` FOREIGN KEY (`intPaciente`) REFERENCES `tbpacientes` (`intPaciente`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbconsultas`
--

LOCK TABLES `tbconsultas` WRITE;
/*!40000 ALTER TABLE `tbconsultas` DISABLE KEYS */;
INSERT INTO `tbconsultas` VALUES (1,1,1,1,'2026-03-19 10:29:56','Congestion Nasas','Congestion Nasal','N/A','Congestion Nasal','Congestion Nasal','Antifluidez','Cuidarse','Normal',NULL,'FINALIZADA','2026-03-19 10:29:56','2026-03-19 10:29:56',0),(2,1,2,1,'2026-03-30 09:08:21','Temperatura',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FINALIZADA','2026-03-30 09:08:21','2026-03-30 09:08:21',0),(3,2,3,1,'2026-03-30 09:08:30','Seguimiento de terapias',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FINALIZADA','2026-03-30 09:08:30','2026-03-30 09:08:30',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbconsultasignosvitales`
--

LOCK TABLES `tbconsultasignosvitales` WRITE;
/*!40000 ALTER TABLE `tbconsultasignosvitales` DISABLE KEYS */;
INSERT INTO `tbconsultasignosvitales` VALUES (1,1,90.00,1.78,28.41,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-19 10:29:56'),(2,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-30 09:08:21'),(3,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-30 09:08:30');
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
-- Table structure for table `tbestudios`
--

DROP TABLE IF EXISTS `tbestudios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbestudios` (
  `intEstudio` int NOT NULL AUTO_INCREMENT,
  `intPaciente` int NOT NULL,
  `intDoctor` int NOT NULL COMMENT 'Doctor que solicitó el estudio',
  `intConsulta` int DEFAULT NULL COMMENT 'Consulta donde se solicitó (opcional)',
  `strTipoEstudio` enum('LABORATORIO','RAYOS_X','ULTRASONIDO','TOMOGRAFIA','RESONANCIA_MAGNETICA','ELECTROCARDIOGRAMA','ENDOSCOPIA','BIOPSIA','OTRO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `strNombreEstudio` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ej: Biometría Hemática Completa',
  `txtIndicaciones` text COLLATE utf8mb4_unicode_ci COMMENT 'Indicaciones para el paciente (ayuno, etc)',
  `datFechaSolicitud` date NOT NULL,
  `datFechaResultado` date DEFAULT NULL COMMENT 'Fecha en que se obtuvieron los resultados',
  `txtResultados` text COLLATE utf8mb4_unicode_ci COMMENT 'Resultados en texto plano',
  `txtInterpretacion` text COLLATE utf8mb4_unicode_ci COMMENT 'Interpretación médica de los resultados',
  `strRutaArchivo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ruta al archivo PDF/imagen en servidor',
  `strNombreArchivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nombre original del archivo',
  `dblTamanoArchivo` decimal(10,2) DEFAULT NULL COMMENT 'Tamaño del archivo en MB',
  `strEstatus` enum('PENDIENTE','EN_PROCESO','COMPLETADO','CANCELADO') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDIENTE',
  `txtObservaciones` text COLLATE utf8mb4_unicode_ci COMMENT 'Observaciones adicionales',
  `datFechaRegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `datFechaActualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isEliminado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`intEstudio`),
  KEY `fk_Estudios_Consulta` (`intConsulta`),
  KEY `idx_paciente` (`intPaciente`),
  KEY `idx_doctor` (`intDoctor`),
  KEY `idx_fecha_solicitud` (`datFechaSolicitud`),
  KEY `idx_estatus` (`strEstatus`),
  KEY `idx_tipo` (`strTipoEstudio`),
  KEY `idx_estudios_paciente_fecha` (`intPaciente`,`datFechaSolicitud` DESC),
  CONSTRAINT `fk_Estudios_Consulta` FOREIGN KEY (`intConsulta`) REFERENCES `tbconsultas` (`intConsulta`),
  CONSTRAINT `fk_Estudios_Doctor` FOREIGN KEY (`intDoctor`) REFERENCES `tbdoctores` (`intDoctor`),
  CONSTRAINT `fk_Estudios_Paciente` FOREIGN KEY (`intPaciente`) REFERENCES `tbpacientes` (`intPaciente`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbestudios`
--

LOCK TABLES `tbestudios` WRITE;
/*!40000 ALTER TABLE `tbestudios` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbestudios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbhistoriaclinica`
--

DROP TABLE IF EXISTS `tbhistoriaclinica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbhistoriaclinica` (
  `intHistoriaClinica` int NOT NULL AUTO_INCREMENT,
  `intPaciente` int NOT NULL,
  `strDiabetes` enum('SI','NO','NO_SABE') COLLATE utf8mb4_unicode_ci DEFAULT 'NO_SABE' COMMENT 'Diabetes en familiares',
  `strHipertension` enum('SI','NO','NO_SABE') COLLATE utf8mb4_unicode_ci DEFAULT 'NO_SABE' COMMENT 'Hipertensión en familiares',
  `strCancer` enum('SI','NO','NO_SABE') COLLATE utf8mb4_unicode_ci DEFAULT 'NO_SABE' COMMENT 'Cáncer en familiares',
  `strCardiopatias` enum('SI','NO','NO_SABE') COLLATE utf8mb4_unicode_ci DEFAULT 'NO_SABE' COMMENT 'Enfermedades cardíacas',
  `strEnfermedadesRenales` enum('SI','NO','NO_SABE') COLLATE utf8mb4_unicode_ci DEFAULT 'NO_SABE',
  `txtDetallesHeredo` text COLLATE utf8mb4_unicode_ci COMMENT 'Detalles adicionales de antecedentes heredofamiliares',
  `txtCirugiasPrevias` text COLLATE utf8mb4_unicode_ci COMMENT 'Cirugías realizadas (fecha y tipo)',
  `txtHospitalizaciones` text COLLATE utf8mb4_unicode_ci COMMENT 'Hospitalizaciones previas',
  `txtTransfusiones` text COLLATE utf8mb4_unicode_ci COMMENT 'Transfusiones sanguíneas',
  `txtFracturas` text COLLATE utf8mb4_unicode_ci COMMENT 'Fracturas o traumatismos',
  `txtAlergiasMedicamentos` text COLLATE utf8mb4_unicode_ci COMMENT 'Alergias medicamentosas',
  `txtEnfermedadesCronicas` text COLLATE utf8mb4_unicode_ci COMMENT 'Enfermedades crónicas diagnosticadas',
  `strTabaquismo` enum('SI','NO','EX_FUMADOR') COLLATE utf8mb4_unicode_ci DEFAULT 'NO',
  `intCigarrillosDia` int DEFAULT '0' COMMENT 'Cigarrillos por día (si fuma)',
  `intAniosFumando` int DEFAULT '0',
  `strAlcoholismo` enum('SI','NO','OCASIONAL') COLLATE utf8mb4_unicode_ci DEFAULT 'NO',
  `strFrecuenciaAlcohol` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Frecuencia de consumo de alcohol',
  `strDrogas` enum('SI','NO') COLLATE utf8mb4_unicode_ci DEFAULT 'NO',
  `txtTipoDrogas` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tipo de drogas consumidas',
  `strActividadFisica` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Frecuencia de ejercicio (sedentario, ligero, moderado, intenso)',
  `txtAlimentacion` text COLLATE utf8mb4_unicode_ci COMMENT 'Descripción de hábitos alimenticios',
  `intMenarca` int DEFAULT NULL COMMENT 'Edad de primera menstruación',
  `datFechaUltimaMenstruacion` date DEFAULT NULL COMMENT 'Fecha de última menstruación (FUM)',
  `intGestas` int DEFAULT '0' COMMENT 'Número de embarazos',
  `intPartos` int DEFAULT '0' COMMENT 'Número de partos',
  `intCesareas` int DEFAULT '0' COMMENT 'Número de cesáreas',
  `intAbortos` int DEFAULT '0' COMMENT 'Número de abortos',
  `txtMetodoAnticonceptivo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Método anticonceptivo actual',
  `txtComplicacionesObstetricas` text COLLATE utf8mb4_unicode_ci COMMENT 'Complicaciones en embarazos previos',
  `datFechaRegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `datFechaActualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `intDoctorRegistro` int DEFAULT NULL COMMENT 'Doctor que registró la historia',
  `isCompleto` tinyint(1) DEFAULT '0' COMMENT 'Indica si la historia está completa',
  PRIMARY KEY (`intHistoriaClinica`),
  UNIQUE KEY `unique_paciente` (`intPaciente`),
  KEY `idx_paciente` (`intPaciente`),
  CONSTRAINT `fk_HistoriaClinica_Paciente` FOREIGN KEY (`intPaciente`) REFERENCES `tbpacientes` (`intPaciente`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbhistoriaclinica`
--

LOCK TABLES `tbhistoriaclinica` WRITE;
/*!40000 ALTER TABLE `tbhistoriaclinica` DISABLE KEYS */;
INSERT INTO `tbhistoriaclinica` VALUES (1,2,'NO','NO','NO','NO','NO',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'NO',0,0,'NO',NULL,'NO',NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,'2026-04-16 11:05:56','2026-04-16 11:05:56',NULL,1),(2,1,'NO','NO','NO','NO','NO',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'NO',0,0,'NO',NULL,'NO',NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,'2026-04-16 11:24:47','2026-04-16 11:24:47',NULL,1);
/*!40000 ALTER TABLE `tbhistoriaclinica` ENABLE KEYS */;
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
-- Table structure for table `tbrecetamedicamentos`
--

DROP TABLE IF EXISTS `tbrecetamedicamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbrecetamedicamentos` (
  `intRecetaMedicamento` int NOT NULL AUTO_INCREMENT,
  `intReceta` int NOT NULL,
  `strMedicamento` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre del medicamento',
  `strPresentacion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tabletas, cápsulas, jarabe, etc',
  `strDosis` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ej: 1 tableta cada 8 horas',
  `intCantidad` int DEFAULT NULL COMMENT 'Cantidad total a dispensar',
  `intDiasTratamiento` int DEFAULT NULL COMMENT 'Duración del tratamiento en días',
  `txtIndicaciones` text COLLATE utf8mb4_unicode_ci COMMENT 'Indicaciones específicas del medicamento',
  `datFechaRegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intRecetaMedicamento`),
  KEY `idx_receta` (`intReceta`),
  CONSTRAINT `fk_RecetaMed_Receta` FOREIGN KEY (`intReceta`) REFERENCES `tbrecetas` (`intReceta`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbrecetamedicamentos`
--

LOCK TABLES `tbrecetamedicamentos` WRITE;
/*!40000 ALTER TABLE `tbrecetamedicamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbrecetamedicamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbrecetas`
--

DROP TABLE IF EXISTS `tbrecetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbrecetas` (
  `intReceta` int NOT NULL AUTO_INCREMENT,
  `intConsulta` int NOT NULL,
  `intPaciente` int NOT NULL,
  `intDoctor` int NOT NULL,
  `strFolio` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Folio único RX-00001',
  `datFechaEmision` date NOT NULL,
  `txtIndicacionesGenerales` text COLLATE utf8mb4_unicode_ci COMMENT 'Indicaciones generales de la receta',
  `strEstatus` enum('ACTIVA','VENCIDA','CANCELADA') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVA',
  `datFechaVencimiento` date DEFAULT NULL COMMENT 'Fecha de vencimiento de la receta',
  `strRutaPDF` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ruta al PDF generado',
  `datFechaRegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `datFechaActualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isEliminado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`intReceta`),
  UNIQUE KEY `strFolio` (`strFolio`),
  UNIQUE KEY `unique_folio` (`strFolio`),
  KEY `fk_Recetas_Consulta` (`intConsulta`),
  KEY `idx_paciente` (`intPaciente`),
  KEY `idx_doctor` (`intDoctor`),
  KEY `idx_fecha` (`datFechaEmision`),
  KEY `idx_estatus` (`strEstatus`),
  CONSTRAINT `fk_Recetas_Consulta` FOREIGN KEY (`intConsulta`) REFERENCES `tbconsultas` (`intConsulta`),
  CONSTRAINT `fk_Recetas_Doctor` FOREIGN KEY (`intDoctor`) REFERENCES `tbdoctores` (`intDoctor`),
  CONSTRAINT `fk_Recetas_Paciente` FOREIGN KEY (`intPaciente`) REFERENCES `tbpacientes` (`intPaciente`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbrecetas`
--

LOCK TABLES `tbrecetas` WRITE;
/*!40000 ALTER TABLE `tbrecetas` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbrecetas` ENABLE KEYS */;
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
-- Temporary view structure for view `vw_consultasdiagnosticos`
--

DROP TABLE IF EXISTS `vw_consultasdiagnosticos`;
/*!50001 DROP VIEW IF EXISTS `vw_consultasdiagnosticos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_consultasdiagnosticos` AS SELECT 
 1 AS `intConsulta`,
 1 AS `intPaciente`,
 1 AS `datFechaConsulta`,
 1 AS `strMotivoConsulta`,
 1 AS `strNombrePaciente`,
 1 AS `strNombreDoctor`,
 1 AS `intConsultaDiagnostico`,
 1 AS `strTipoDiagnostico`,
 1 AS `txtNotasDiagnostico`,
 1 AS `intCIE10`,
 1 AS `strCodigoCIE10`,
 1 AS `strDescripcionDiagnostico`,
 1 AS `strCategoria`,
 1 AS `strCapitulo`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_expedientecompleto`
--

DROP TABLE IF EXISTS `vw_expedientecompleto`;
/*!50001 DROP VIEW IF EXISTS `vw_expedientecompleto`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_expedientecompleto` AS SELECT 
 1 AS `intPaciente`,
 1 AS `strNombrePaciente`,
 1 AS `strGenero`,
 1 AS `datFechaNacimiento`,
 1 AS `intEdad`,
 1 AS `strEmail`,
 1 AS `strTelefono`,
 1 AS `strTipoSangre`,
 1 AS `strAlergias`,
 1 AS `strEnfermedadesCronicas`,
 1 AS `strEstatus`,
 1 AS `intHistoriaClinica`,
 1 AS `historiaCompleta`,
 1 AS `strTabaquismo`,
 1 AS `strAlcoholismo`,
 1 AS `heredoDiabetes`,
 1 AS `heredoHipertension`,
 1 AS `totalConsultas`,
 1 AS `totalEstudios`,
 1 AS `totalArchivos`,
 1 AS `totalRecetas`,
 1 AS `ultimaConsulta`,
 1 AS `ultimoDiagnostico`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_consultasdiagnosticos`
--

/*!50001 DROP VIEW IF EXISTS `vw_consultasdiagnosticos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_consultasdiagnosticos` AS select `c`.`intConsulta` AS `intConsulta`,`c`.`intPaciente` AS `intPaciente`,`c`.`datFechaConsulta` AS `datFechaConsulta`,`c`.`strMotivoConsulta` AS `strMotivoConsulta`,`p`.`strNombre` AS `strNombrePaciente`,concat(`d`.`strNombre`,' ',`d`.`strApellidos`) AS `strNombreDoctor`,`cd`.`intConsultaDiagnostico` AS `intConsultaDiagnostico`,`cd`.`strTipoDiagnostico` AS `strTipoDiagnostico`,`cd`.`txtNotasDiagnostico` AS `txtNotasDiagnostico`,`cie`.`intCIE10` AS `intCIE10`,`cie`.`strCodigo` AS `strCodigoCIE10`,`cie`.`strDescripcion` AS `strDescripcionDiagnostico`,`cie`.`strCategoria` AS `strCategoria`,`cie`.`strCapitulo` AS `strCapitulo` from ((((`tbconsultas` `c` left join `tbconsultadiagnosticos` `cd` on((`c`.`intConsulta` = `cd`.`intConsulta`))) left join `tbcatalogocie10` `cie` on((`cd`.`intCIE10` = `cie`.`intCIE10`))) join `tbpacientes` `p` on((`c`.`intPaciente` = `p`.`intPaciente`))) join `tbdoctores` `d` on((`c`.`intDoctor` = `d`.`intDoctor`))) where (`c`.`isEliminado` = 0) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_expedientecompleto`
--

/*!50001 DROP VIEW IF EXISTS `vw_expedientecompleto`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_expedientecompleto` AS select `p`.`intPaciente` AS `intPaciente`,`p`.`strNombre` AS `strNombrePaciente`,`p`.`strGenero` AS `strGenero`,`p`.`datFechaNacimiento` AS `datFechaNacimiento`,`p`.`intEdad` AS `intEdad`,`p`.`strEmail` AS `strEmail`,`p`.`strTelefono` AS `strTelefono`,`p`.`strTipoSangre` AS `strTipoSangre`,`p`.`strAlergias` AS `strAlergias`,`p`.`strEnfermedadesCronicas` AS `strEnfermedadesCronicas`,`p`.`strEstatus` AS `strEstatus`,`hc`.`intHistoriaClinica` AS `intHistoriaClinica`,`hc`.`isCompleto` AS `historiaCompleta`,`hc`.`strTabaquismo` AS `strTabaquismo`,`hc`.`strAlcoholismo` AS `strAlcoholismo`,`hc`.`strDiabetes` AS `heredoDiabetes`,`hc`.`strHipertension` AS `heredoHipertension`,(select count(0) from `tbconsultas` where ((`tbconsultas`.`intPaciente` = `p`.`intPaciente`) and (`tbconsultas`.`isEliminado` = 0))) AS `totalConsultas`,(select count(0) from `tbestudios` where ((`tbestudios`.`intPaciente` = `p`.`intPaciente`) and (`tbestudios`.`isEliminado` = 0))) AS `totalEstudios`,(select count(0) from `tbarchivosadjuntos` where ((`tbarchivosadjuntos`.`intPaciente` = `p`.`intPaciente`) and (`tbarchivosadjuntos`.`isEliminado` = 0))) AS `totalArchivos`,(select count(0) from `tbrecetas` where ((`tbrecetas`.`intPaciente` = `p`.`intPaciente`) and (`tbrecetas`.`isEliminado` = 0))) AS `totalRecetas`,(select `tbconsultas`.`datFechaConsulta` from `tbconsultas` where ((`tbconsultas`.`intPaciente` = `p`.`intPaciente`) and (`tbconsultas`.`isEliminado` = 0)) order by `tbconsultas`.`datFechaConsulta` desc limit 1) AS `ultimaConsulta`,(select `tbconsultas`.`strDiagnostico` from `tbconsultas` where ((`tbconsultas`.`intPaciente` = `p`.`intPaciente`) and (`tbconsultas`.`isEliminado` = 0)) order by `tbconsultas`.`datFechaConsulta` desc limit 1) AS `ultimoDiagnostico` from (`tbpacientes` `p` left join `tbhistoriaclinica` `hc` on((`p`.`intPaciente` = `hc`.`intPaciente`))) where (`p`.`isEliminado` = 0) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-17 18:08:44
