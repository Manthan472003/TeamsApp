CREATE DATABASE TeamsApp;
USE TeamsApp;

CREATE TABLE `user_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(200) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` longtext NOT NULL,
  `userType` enum('Admin','Developer','FieldWorker','Doctor') DEFAULT 'FieldWorker',
  `token` longtext,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `Email` (`email`),
  UNIQUE KEY `Email_2` (`email`),
  UNIQUE KEY `Email_3` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tags_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tagName` varchar(300) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `tasks_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taskName` varchar(255) NOT NULL,
  `description` text,
  `dueDate` datetime DEFAULT NULL,
  `subTask` text,
  `taskAssignedToID` int DEFAULT NULL,
  `taskCreatedByID` int DEFAULT NULL,
  `status` enum('Not Started','In Progress','Completed','On Hold') DEFAULT 'Not Started',
  `sectionID` int DEFAULT NULL,
  `platformType` enum('iOS','Android','Linux','WindowsOS','MacOS','Web','Platform-Independent') DEFAULT 'Platform-Independent',
  `tagIDs` json DEFAULT NULL,
  `notificationIDs` json DEFAULT NULL,
  `isDelete` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `AssigneeID_idx` (`taskCreatedByID`),
  KEY `SectionID_idx` (`sectionID`),
  KEY `TaskAssignedToID_idx` (`taskAssignedToID`),
  CONSTRAINT `SectionID` FOREIGN KEY (`sectionID`) REFERENCES `section_table` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `TaskAssignedToID` FOREIGN KEY (`taskAssignedToID`) REFERENCES `user_table` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `TaskCreatedByID` FOREIGN KEY (`taskCreatedByID`) REFERENCES `user_table` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=239 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `section_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sectionName` varchar(45) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `version_management_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `technologyUsed` varchar(255) DEFAULT NULL,
  `currentVersion` varchar(45) DEFAULT NULL,
  `latestVersion` varchar(45) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `userID_idx` (`userId`),
  CONSTRAINT `userIdForVersionManagementTable` FOREIGN KEY (`userId`) REFERENCES `user_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `notifications_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `notificationText` longtext,
  `userIds` json DEFAULT NULL,
  `notificationSeenByUserIds` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `media_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mediaLink` longtext,
  `taskId` int DEFAULT NULL,
  `mediaType` enum('Image','Video') DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `taskIdForMedia_idx` (`taskId`),
  CONSTRAINT `taskIdForMedia` FOREIGN KEY (`taskId`) REFERENCES `tasks_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `daily_reports_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `taskName` varchar(255) DEFAULT NULL,
  `taskId` int DEFAULT NULL,
  `status` enum('Completed','In Progress','On Hold','Research') DEFAULT 'In Progress',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `userID_idx` (`userId`),
  KEY `taskIdFor DailyReports` (`taskId`),
  CONSTRAINT `taskIdFor DailyReports` FOREIGN KEY (`taskId`) REFERENCES `tasks_table` (`id`),
  CONSTRAINT `userIdForDailyReports` FOREIGN KEY (`userId`) REFERENCES `user_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `comments_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `commentText` text,
  `taskId` int DEFAULT NULL,
  `createdByUserId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `taskIdForComments` (`taskId`),
  KEY `userIdForComments` (`createdByUserId`),
  CONSTRAINT `taskIdForComments` FOREIGN KEY (`taskId`) REFERENCES `tasks_table` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `userIdForComments` FOREIGN KEY (`createdByUserId`) REFERENCES `user_table` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `app_version_management_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicationName` varchar(255) DEFAULT NULL,
  `liveVersion` varchar(45) DEFAULT NULL,
  `testVersion` varchar(45) DEFAULT NULL,
  `status` enum('Not Started','Working On','Submitted','In Review') DEFAULT 'Not Started',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `build_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appId` int NOT NULL,
  `deployedOn` enum('Stage','Production') DEFAULT 'Production',
  `versionName` varchar(45) DEFAULT NULL,
  `mediaLink` longtext,
  `checkedIds` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `applicationId_idx` (`appId`),
  CONSTRAINT `applicationId` FOREIGN KEY (`appId`) REFERENCES `section_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `tasks_checked_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taskId` int NOT NULL,
  `checkedByUserId` int NOT NULL,
  `isWorking` tinyint DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_taskId` (`taskId`),
  KEY `fk_checkedByUserId` (`checkedByUserId`),
  CONSTRAINT `fk_checkedByUserId` FOREIGN KEY (`checkedByUserId`) REFERENCES `user_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_taskId` FOREIGN KEY (`taskId`) REFERENCES `tasks_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
