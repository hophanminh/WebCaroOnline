CREATE DATABASE  IF NOT EXISTS `caro_online` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `caro_online`;
-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: caro_online
-- ------------------------------------------------------
-- Server version	8.0.20

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
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `roomID` varchar(45) NOT NULL,
  `userID` int NOT NULL,
  `message` text NOT NULL,
  `status` tinyint DEFAULT '1',
  `dateCreate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`ID`,`roomID`,`userID`),
  KEY `MESSAGE_ROOM_idx` (`roomID`),
  KEY `MESSAGE_USER_idx` (`userID`),
  CONSTRAINT `MESSAGE_ROOM` FOREIGN KEY (`roomID`) REFERENCES `room` (`ID`),
  CONSTRAINT `MESSAGE_USER` FOREIGN KEY (`userID`) REFERENCES `user` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,'Masa',1,'2020-12-30 16:18:11.176000'),(2,'5af312ad-e6f3-432e-8905-91bf2037e0a8',29,'hello',1,'2020-12-30 16:18:16.362000'),(3,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,'a',1,'2020-12-30 16:20:16.224000'),(4,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,'awd',1,'2020-12-30 16:20:24.546000'),(5,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,'asd',1,'2020-12-30 16:20:26.478000'),(6,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,'dawdawd',1,'2020-12-30 16:20:28.256000'),(7,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,'asdasda',1,'2020-12-30 16:20:30.081000'),(8,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,'awdawdawdawd',1,'2020-12-30 16:20:32.022000'),(9,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,'asdasdaw',1,'2020-12-30 16:20:36.796000'),(10,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,'asdsadasd',1,'2020-12-30 16:20:38.446000'),(11,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,'g',1,'2020-12-30 17:10:02.895000'),(12,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',38,'hello',1,'2020-12-30 17:24:46.734000'),(13,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',29,'hi',1,'2020-12-30 17:24:49.302000'),(14,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,'hello',1,'2020-12-30 17:46:44.594000'),(15,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,'hi',1,'2020-12-30 17:46:47.034000'),(16,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',38,'dwa',1,'2020-12-31 07:44:53.315000'),(17,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',38,'a',1,'2020-12-31 07:53:30.657000'),(18,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',38,'awd',1,'2020-12-31 07:53:57.336000'),(19,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',38,'awdawd',1,'2020-12-31 07:53:58.263000'),(20,'7114d4b2-7791-496d-ae5b-9c9b2fbae804',38,'awdaw',1,'2021-01-01 19:13:49.394000'),(21,'7114d4b2-7791-496d-ae5b-9c9b2fbae804',37,'w',1,'2021-01-01 19:58:09.534000');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `move`
--

DROP TABLE IF EXISTS `move`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `move` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `roomID` varchar(255) NOT NULL,
  `userID` int NOT NULL,
  `turn` int DEFAULT NULL,
  `position` int DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `winningLine` tinyint DEFAULT '0',
  PRIMARY KEY (`ID`,`roomID`),
  KEY `MOVE_BOARD_idx` (`roomID`),
  KEY `MOVE_USER_idx` (`userID`),
  CONSTRAINT `MOVE_BOARD` FOREIGN KEY (`roomID`) REFERENCES `room` (`ID`),
  CONSTRAINT `MOVE_USER` FOREIGN KEY (`userID`) REFERENCES `user` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=306 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `move`
--

LOCK TABLES `move` WRITE;
/*!40000 ALTER TABLE `move` DISABLE KEYS */;
INSERT INTO `move` VALUES (185,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,1,0,1,0),(186,'5af312ad-e6f3-432e-8905-91bf2037e0a8',29,2,1,1,0),(187,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,3,50,1,0),(188,'5af312ad-e6f3-432e-8905-91bf2037e0a8',29,4,51,1,0),(189,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,5,100,1,0),(190,'5af312ad-e6f3-432e-8905-91bf2037e0a8',29,6,101,1,0),(191,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,7,150,1,0),(192,'5af312ad-e6f3-432e-8905-91bf2037e0a8',29,8,151,1,0),(193,'5af312ad-e6f3-432e-8905-91bf2037e0a8',38,9,200,1,0),(194,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',38,1,0,1,0),(195,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',29,2,1,1,0),(196,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',38,3,51,1,0),(197,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',29,4,52,1,0),(198,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',38,5,102,1,0),(199,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',29,6,103,1,0),(200,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',38,7,153,1,0),(201,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',29,8,154,1,0),(202,'33c03d48-4ea6-4bd8-885c-8a98666f7db3',38,9,204,1,0),(203,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,1,52,1,0),(204,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,2,203,1,0),(205,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,3,101,1,0),(206,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,4,5,1,0),(207,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,5,257,1,0),(208,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,6,156,1,0),(229,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,7,0,1,0),(230,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,10,200,1,0),(231,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,9,1,1,0),(232,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,10,302,1,0),(233,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,11,351,1,0),(234,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,12,402,1,0),(235,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,13,154,1,0),(236,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,14,304,1,0),(237,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,15,404,1,0),(238,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,16,450,1,0),(239,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,17,902,1,0),(240,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,18,752,1,0),(241,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,19,453,1,0),(242,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,20,551,1,0),(243,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,21,300,1,0),(244,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,22,152,1,0),(245,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,23,653,1,0),(246,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,24,651,1,0),(247,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,25,502,1,0),(248,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,26,603,1,0),(249,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,27,552,1,0),(250,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,28,605,1,0),(251,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',38,29,800,1,0),(252,'f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8',29,30,754,1,0),(253,'8b7756c1-b2f0-4d25-84a4-6bc693aec50e',38,1,0,1,0),(254,'8b7756c1-b2f0-4d25-84a4-6bc693aec50e',29,2,1,1,0),(255,'8b7756c1-b2f0-4d25-84a4-6bc693aec50e',38,3,50,1,0),(256,'8b7756c1-b2f0-4d25-84a4-6bc693aec50e',29,4,101,1,0),(257,'8b7756c1-b2f0-4d25-84a4-6bc693aec50e',38,5,100,1,0),(258,'8b7756c1-b2f0-4d25-84a4-6bc693aec50e',29,6,103,1,0),(259,'8b7756c1-b2f0-4d25-84a4-6bc693aec50e',38,7,150,1,0),(260,'8b7756c1-b2f0-4d25-84a4-6bc693aec50e',29,8,151,1,0),(261,'8b7756c1-b2f0-4d25-84a4-6bc693aec50e',38,9,200,1,0),(262,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',38,1,0,1,0),(263,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',29,2,1,1,0),(264,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',38,3,50,1,0),(265,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',29,4,101,1,0),(266,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',38,5,150,1,0),(267,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',29,6,201,1,0),(268,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',38,7,250,1,0),(269,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',29,8,253,1,0),(270,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',38,9,302,1,0),(271,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',29,10,351,1,0),(272,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',38,11,400,1,0),(273,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',29,12,452,1,0),(274,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',38,13,402,1,0),(275,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',29,14,403,1,0),(276,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',38,15,153,1,0),(277,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',29,16,53,1,0),(278,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',38,17,104,1,0),(279,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',29,18,103,1,0),(280,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',38,19,54,1,0),(281,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',29,20,102,1,0),(282,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',38,21,152,1,0),(283,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',29,22,154,1,0),(284,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',38,23,155,1,0),(285,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',29,24,205,1,0),(286,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',38,25,156,1,0),(287,'d1a978b1-e5e3-4f1d-bccf-a29a55c60739',29,26,52,1,0),(288,'e07e78e1-0468-4ff7-bc5c-3d12338d4dcd',29,1,0,1,0),(289,'e07e78e1-0468-4ff7-bc5c-3d12338d4dcd',38,2,1,1,0),(290,'e07e78e1-0468-4ff7-bc5c-3d12338d4dcd',29,3,50,1,0),(291,'e07e78e1-0468-4ff7-bc5c-3d12338d4dcd',38,4,51,1,0),(292,'e07e78e1-0468-4ff7-bc5c-3d12338d4dcd',29,5,100,1,0),(293,'e07e78e1-0468-4ff7-bc5c-3d12338d4dcd',38,6,101,1,0),(294,'e07e78e1-0468-4ff7-bc5c-3d12338d4dcd',29,7,150,1,0),(295,'e07e78e1-0468-4ff7-bc5c-3d12338d4dcd',38,8,151,1,0),(296,'e07e78e1-0468-4ff7-bc5c-3d12338d4dcd',29,9,200,1,0),(297,'1c86aca8-a4ac-48e9-9b8b-84d4000c3471',38,1,53,1,0),(298,'1c86aca8-a4ac-48e9-9b8b-84d4000c3471',29,2,52,1,0),(299,'1c86aca8-a4ac-48e9-9b8b-84d4000c3471',38,3,102,1,0),(300,'1c86aca8-a4ac-48e9-9b8b-84d4000c3471',29,4,103,1,0),(301,'1c86aca8-a4ac-48e9-9b8b-84d4000c3471',38,5,151,1,0),(302,'1c86aca8-a4ac-48e9-9b8b-84d4000c3471',29,6,154,1,0),(303,'1c86aca8-a4ac-48e9-9b8b-84d4000c3471',38,7,200,1,0),(304,'1c86aca8-a4ac-48e9-9b8b-84d4000c3471',29,8,205,1,0),(305,'1c86aca8-a4ac-48e9-9b8b-84d4000c3471',38,9,4,1,0);
/*!40000 ALTER TABLE `move` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pageverrify`
--

DROP TABLE IF EXISTS `pageverrify`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pageverrify` (
  `idpageVerrify` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `hashLink` varchar(45) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `status` int DEFAULT '0',
  PRIMARY KEY (`idpageVerrify`),
  UNIQUE KEY `hashLink_UNIQUE` (`hashLink`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pageverrify`
--

LOCK TABLES `pageverrify` WRITE;
/*!40000 ALTER TABLE `pageverrify` DISABLE KEYS */;
/*!40000 ALTER TABLE `pageverrify` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `ID` varchar(255) NOT NULL,
  `dateCreate` datetime(6) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `idUser1` int DEFAULT NULL,
  `idUser2` int DEFAULT NULL,
  `winner` int DEFAULT '-1',
  PRIMARY KEY (`ID`),
  KEY `BOARD_USER1_idx` (`idUser1`),
  KEY `BOARD_USER1_idx1` (`idUser2`),
  CONSTRAINT `BOARD_USER1` FOREIGN KEY (`idUser1`) REFERENCES `user` (`ID`),
  CONSTRAINT `BOARD_USER2` FOREIGN KEY (`idUser2`) REFERENCES `user` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES ('0a758cb1-6070-4a94-88c9-e644c1f104d0','2021-01-01 21:52:48.296000',1,38,NULL,-1),('1c86aca8-a4ac-48e9-9b8b-84d4000c3471','2021-01-01 23:42:51.765000',1,38,29,2),('22c35d84-5690-46d8-b411-a4adbfd3baa2','2020-12-19 10:09:32.886000',1,36,38,-1),('2df1de01-7e97-4929-95c7-c614db7356c0','2020-12-19 10:09:47.988000',1,36,NULL,-1),('33c03d48-4ea6-4bd8-885c-8a98666f7db3','2020-12-30 17:24:34.237000',1,38,29,1),('5af312ad-e6f3-432e-8905-91bf2037e0a8','2020-12-30 16:11:48.785000',1,38,29,1),('7114d4b2-7791-496d-ae5b-9c9b2fbae804','2020-12-19 10:09:42.697000',1,36,NULL,-1),('8b7756c1-b2f0-4d25-84a4-6bc693aec50e','2021-01-01 18:35:38.562000',1,38,29,1),('b128e059-01fd-4cc3-aae3-2726327a2fac','2021-01-01 18:37:13.710000',1,38,NULL,-1),('d1a978b1-e5e3-4f1d-bccf-a29a55c60739','2021-01-01 20:21:17.658000',1,38,29,2),('e07e78e1-0468-4ff7-bc5c-3d12338d4dcd','2021-01-01 23:35:05.306000',1,29,38,1),('e5274ee8-58c8-43fa-b343-ef6245b6e820','2020-12-19 10:09:50.350000',1,36,38,1),('ee87e961-058a-44bd-885f-94cf7180efc2','2020-12-19 10:01:07.708000',1,36,NULL,-1),('f7f8ee7b-23f8-48bc-ac73-5b8e5a68d8b8','2020-12-30 17:46:25.373000',1,38,29,2);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `permission` int DEFAULT '0',
  `score` int DEFAULT '0',
  `status` int DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (29,'masa@gmail.com','minh','$2b$10$E8jBOoibHR6ZwP2J/ETI4.nQd8E6dRpYpYGYEgdUr.x19x9J9Pn2i','masa',0,0,1),(36,'hophanminh@gmail.com','hophanminh','$2b$10$IXkdQXUhOVh.WNxKICLGh.pmMdqXoVb5pd8hB8yJXEfcGPT5AlD5S','hophanminh',1,0,1),(37,'super_admin@gmail.com','super_admin','$2b$10$ez3CmYhL5VV6SaXrH/mrC.VTozOc0GuqQkv/S3BgKi/Rpgpbsisp2','super_admin',1,0,1),(38,'admin@gmail.com','admin1','$2b$10$VEa6vL4gyk/yhYRWdZlonux7gz9CbyoNz1UhCJy0Eu0dBe2wLTZRm','admin',1,1000,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-02  9:04:23
