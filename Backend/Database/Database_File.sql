CREATE DATABASE TeamsApp;
USE TeamsApp;

CREATE TABLE `imagetable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imageLink` longtext NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sectiontable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sectionName` varchar(45) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tagstable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tagName` varchar(300) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `taskimagetable` (
  `taskID` int NOT NULL,
  `imageID` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `TaskIDForImage_idx` (`taskID`),
  KEY `ImageID_idx` (`imageID`),
  CONSTRAINT `ImageID` FOREIGN KEY (`imageID`) REFERENCES `imagetable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `TaskIDForImage` FOREIGN KEY (`taskID`) REFERENCES `taskstable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `taskstable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taskName` varchar(255) NOT NULL,
  `description` text,
  `dueDate` datetime DEFAULT NULL,
  `subTask` text,
  `taskAssignedToID` int DEFAULT NULL,
  `taskCreatedByID` int DEFAULT NULL,
  `status` enum('Not Started','In Progress','Completed','On Hold') DEFAULT 'Not Started',
  `sectionID` int DEFAULT NULL,
  `tagIDs` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `AssigneeID_idx` (`taskCreatedByID`),
  KEY `SectionID_idx` (`sectionID`),
  KEY `TaskAssignedToID_idx` (`taskAssignedToID`),
  CONSTRAINT `SectionID` FOREIGN KEY (`sectionID`) REFERENCES `sectiontable` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `TaskAssignedToID` FOREIGN KEY (`taskAssignedToID`) REFERENCES `usertable` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `TaskCreatedByID` FOREIGN KEY (`taskCreatedByID`) REFERENCES `usertable` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tasktagtable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taskID` int NOT NULL,
  `tagID` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `TaskID_idx` (`taskID`),
  KEY `TagsID_idx` (`tagID`),
  CONSTRAINT `TagID` FOREIGN KEY (`tagID`) REFERENCES `tagstable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `TaskID` FOREIGN KEY (`taskID`) REFERENCES `taskstable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `usertable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(200) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(45) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `Email` (`email`),
  UNIQUE KEY `Email_2` (`email`),
  UNIQUE KEY `Email_3` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `version_management_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `technologyUsed` varchar(45) DEFAULT NULL,
  `currentVersion` varchar(45) DEFAULT NULL,
  `latestVersion` varchar(45) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `userID_idx` (`userId`),
  CONSTRAINT `userID` FOREIGN KEY (`userId`) REFERENCES `user_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `daily_reports_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `taskName` varchar(255) DEFAULT NULL,
  `status` enum('Completed','In Progress','On Hold','Research') DEFAULT 'In Progress',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `userID_idx` (`userId`),
  CONSTRAINT `userIdForDailyReports` FOREIGN KEY (`userId`) REFERENCES `user_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

