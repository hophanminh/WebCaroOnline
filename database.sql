-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: caro_online
-- ------------------------------------------------------
-- Server version	8.0.18

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
-- Table structure for table `move`
--
Create DATABASE caro_online
DROP TABLE IF EXISTS `move`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `move` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `boardID` varchar(255) NOT NULL,
  `userID` int(11) NOT NULL,
  `turn` int(11) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '1',
  `winningLine` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`ID`,`boardID`),
  KEY `MOVE_BOARD_idx` (`boardID`),
  KEY `MOVE_USER_idx` (`userID`),
  CONSTRAINT `MOVE_BOARD` FOREIGN KEY (`boardID`) REFERENCES `room` (`ID`),
  CONSTRAINT `MOVE_USER` FOREIGN KEY (`userID`) REFERENCES `user` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `move`
--

LOCK TABLES `move` WRITE;
/*!40000 ALTER TABLE `move` DISABLE KEYS */;
/*!40000 ALTER TABLE `move` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pageverrify`
--

DROP TABLE IF EXISTS `pageverrify`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pageverrify` (
  `idpageVerrify` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `hashLink` varchar(45) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `status` int(11) DEFAULT '0',
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
  `status` tinyint(4) DEFAULT '1',
  `idUser1` int(11) NOT NULL,
  `idUser2` int(11) DEFAULT NULL,
  `winner` int(11) DEFAULT '-1',
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
INSERT INTO `room` VALUES ('22c35d84-5690-46d8-b411-a4adbfd3baa2','2020-12-19 10:09:32.886000',1,36,NULL,-1),('2df1de01-7e97-4929-95c7-c614db7356c0','2020-12-19 10:09:47.988000',1,36,NULL,-1),('7114d4b2-7791-496d-ae5b-9c9b2fbae804','2020-12-19 10:09:42.697000',1,36,NULL,-1),('e5274ee8-58c8-43fa-b343-ef6245b6e820','2020-12-19 10:09:50.350000',1,36,NULL,-1),('ee87e961-058a-44bd-885f-94cf7180efc2','2020-12-19 10:01:07.708000',1,36,NULL,-1);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `permission` int(11) DEFAULT '0',
  `score` int(11) DEFAULT '0',
  `status` int(11) DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (29,'masa@gmail.com','minh','$2b$10$E8jBOoibHR6ZwP2J/ETI4.nQd8E6dRpYpYGYEgdUr.x19x9J9Pn2i','masa',0,0,1),(36,'hophanminh@gmail.com','hophanminh','$2b$10$IXkdQXUhOVh.WNxKICLGh.pmMdqXoVb5pd8hB8yJXEfcGPT5AlD5S','hophanminh',1,0,1),(37,'super_admin@gmail.com','super_admin','$2b$10$ez3CmYhL5VV6SaXrH/mrC.VTozOc0GuqQkv/S3BgKi/Rpgpbsisp2','super_admin',1,0,1),(38,'admin@gmail.com','admin1','$2b$10$VEa6vL4gyk/yhYRWdZlonux7gz9CbyoNz1UhCJy0Eu0dBe2wLTZRm','admin',1,0,1);
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

-- Dump completed on 2020-12-30  0:22:22
