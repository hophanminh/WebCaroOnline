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
-- Table structure for table `move`
--

DROP TABLE IF EXISTS `move`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `move` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `boardID` varchar(255) NOT NULL,
  `userID` int NOT NULL,
  `turn` int DEFAULT NULL,
  `position` int DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `winningLine` tinyint DEFAULT '0',
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
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `ID` varchar(255) NOT NULL,
  `dateCreate` datetime(6) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `idUser1` int NOT NULL,
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
  `status` bit(1) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (29,'masa@gmail.com','minh','$2b$10$E8jBOoibHR6ZwP2J/ETI4.nQd8E6dRpYpYGYEgdUr.x19x9J9Pn2i','masa',0,0,0x01),(36,'hophanminh@gmail.com','hophanminh','$2b$10$IXkdQXUhOVh.WNxKICLGh.pmMdqXoVb5pd8hB8yJXEfcGPT5AlD5S','hophanminh',1,0,0x01),(37,'super_admin@gmail.com','super_admin','$2b$10$ez3CmYhL5VV6SaXrH/mrC.VTozOc0GuqQkv/S3BgKi/Rpgpbsisp2','super_admin',1,0,0x01),(38,'admin@gmail.com','admin1','$2b$10$VEa6vL4gyk/yhYRWdZlonux7gz9CbyoNz1UhCJy0Eu0dBe2wLTZRm','admin',1,0,0x01);
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

-- Dump completed on 2020-12-14 18:20:29
