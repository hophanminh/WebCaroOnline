


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
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


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
) ENGINE=InnoDB AUTO_INCREMENT=435 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `pageverrify` (
  `idpageVerrify` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `hashLink` varchar(45) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `status` int DEFAULT '0',
  PRIMARY KEY (`idpageVerrify`),
  UNIQUE KEY `hashLink_UNIQUE` (`hashLink`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




INSERT INTO `user` VALUES (29,'masa@gmail.com','minh','$2b$10$E8jBOoibHR6ZwP2J/ETI4.nQd8E6dRpYpYGYEgdUr.x19x9J9Pn2i','masa',0,203,1),(36,'hophanminh@gmail.com','hophanminh','$2b$10$IXkdQXUhOVh.WNxKICLGh.pmMdqXoVb5pd8hB8yJXEfcGPT5AlD5S','hophanminh',1,0,1),(37,'super_admin@gmail.com','super_admin','$2b$10$ez3CmYhL5VV6SaXrH/mrC.VTozOc0GuqQkv/S3BgKi/Rpgpbsisp2','super_admin',1,0,1),(38,'admin@gmail.com','admin2','$2b$10$VEa6vL4gyk/yhYRWdZlonux7gz9CbyoNz1UhCJy0Eu0dBe2wLTZRm','admin',1,509,1);
