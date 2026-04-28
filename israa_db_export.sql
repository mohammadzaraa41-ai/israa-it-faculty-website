-- ISRAA IT FACULTY DATABASE EXPORT
-- Format: SQL (MySQL Compatible)
-- Generated on: 2026-04-26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table: departments
-- --------------------------------------------------------
CREATE TABLE `departments` (
  `id` varchar(20) NOT NULL,
  `name_ar` varchar(100) NOT NULL,
  `name_en` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `departments` (`id`, `name_ar`, `name_en`) VALUES
('cs', 'علم الحاسوب', 'Computer Science'),
('se', 'هندسة البرمجيات', 'Software Engineering'),
('cyber', 'الأمن السيبراني', 'Cyber Security'),
('dsai', 'علم البيانات والذكاء الاصطناعي', 'Data Science & AI');

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('SUPER_ADMIN','STUDENT','DEAN') NOT NULL,
  `name_ar` varchar(100) DEFAULT NULL,
  `name_en` varchar(100) DEFAULT NULL,
  `departmentId` varchar(20) DEFAULT NULL,
  `isAlumni` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `username`, `password`, `role`, `name_ar`, `name_en`, `departmentId`, `isAlumni`) VALUES
('u1', 'AE2551', '123', 'SUPER_ADMIN', 'مدير النظام', 'System Admin', 'cs', 0),
('u2', '20240001', '123', 'STUDENT', 'أحمد علي', 'Ahmed Ali', 'se', 0);

-- --------------------------------------------------------
-- Table: faculty_members
-- --------------------------------------------------------
CREATE TABLE `faculty_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `departmentId` varchar(20) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `office` varchar(255) DEFAULT NULL,
  `officeHours` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `faculty_members` (`id`, `name`, `departmentId`, `role`, `specialization`, `office`, `officeHours`) VALUES
(1, 'أ.د. أحمد محمد', 'cs', 'العميد', 'الذكاء الاصطناعي', 'مكتب العميد', '10:00 - 12:00'),
(2, 'د. سارة عيسى', 'se', 'رئيس قسم', 'هندسة البرمجيات', 'مكتب 304', '09:00 - 11:00');

-- --------------------------------------------------------
-- Table: offered_courses
-- --------------------------------------------------------
CREATE TABLE `offered_courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `hours` varchar(50) DEFAULT NULL,
  `instructorId` int(11) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`instructorId`) REFERENCES `faculty_members` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `offered_courses` (`id`, `title`, `hours`, `instructorId`, `state`) VALUES
(1, 'معسكر تطوير واجهات الويب (React)', '40 ساعة', 1, 'متاح للتسجيل'),
(2, 'دورة الأمن السيبراني المتقدم', '30 ساعة', 2, 'متاح للتسجيل');

-- --------------------------------------------------------
-- Table: project_bank
-- --------------------------------------------------------
CREATE TABLE `project_bank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_ar` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `supervisorId` int(11) DEFAULT NULL,
  `rating` float DEFAULT 0,
  `notes_ar` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`supervisorId`) REFERENCES `faculty_members` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `project_bank` (`id`, `name_ar`, `name_en`, `supervisorId`, `rating`, `notes_ar`) VALUES
(1, 'نظام إدارة المستشفيات الذكي', 'Smart Hospital Management', 2, 4.5, 'مشروع متميز جداً.');

COMMIT;
