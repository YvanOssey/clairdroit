-- Initialisation non destructive de ClairDroit sur MySQL Railway.
-- Ce script crée uniquement les tables manquantes et ne contient aucune donnée ni aucun secret.

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `openId` varchar(64) NOT NULL,
  `name` text,
  `email` varchar(320),
  `loginMethod` varchar(64),
  `passwordHash` text,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_openId_unique` (`openId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(220) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `content` text NOT NULL,
  `category` varchar(120) NOT NULL,
  `editorialSection` enum('actualite','vulgarisation','analyses','carrieres') NOT NULL DEFAULT 'actualite',
  `author` varchar(160) NOT NULL,
  `coverImage` text,
  `seoTitle` varchar(255),
  `seoDescription` text,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `publishedAt` timestamp NULL,
  `authorId` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `articles_slug_unique` (`slug`),
  KEY `articles_authorId_idx` (`authorId`),
  CONSTRAINT `articles_authorId_users_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `siteSettings` (
  `id` int NOT NULL,
  `siteName` varchar(120) NOT NULL,
  `siteTagline` varchar(180) NOT NULL,
  `logoUrl` text,
  `navHomeLabel` varchar(80) NOT NULL,
  `navArticlesLabel` varchar(80) NOT NULL,
  `navCategoriesLabel` varchar(80) NOT NULL,
  `navAboutLabel` varchar(80) NOT NULL,
  `navCareersLabel` varchar(80) NOT NULL,
  `navContactLabel` varchar(80) NOT NULL,
  `homeEyebrow` varchar(180) NOT NULL,
  `homeTitleMain` varchar(180) NOT NULL,
  `homeTitleAccent` varchar(180) NOT NULL,
  `homeTitleEnd` varchar(180) NOT NULL,
  `homeDescription` text NOT NULL,
  `homePrimaryCta` varchar(120) NOT NULL,
  `homeSecondaryCta` varchar(120) NOT NULL,
  `footerDescription` text NOT NULL,
  `footerKicker` varchar(180) NOT NULL,
  `newsletterTitle` varchar(120) NOT NULL,
  `newsletterDescription` text NOT NULL,
  `socialLinks` text,
  `pageContent` text,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contactMessages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(160) NOT NULL,
  `email` varchar(320) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','archived') NOT NULL DEFAULT 'new',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `newsletterSubscribers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(320) NOT NULL,
  `status` enum('active','unsubscribed') NOT NULL DEFAULT 'active',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `newsletterSubscribers_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
