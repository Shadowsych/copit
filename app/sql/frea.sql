-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 08, 2019 at 01:43 PM
-- Server version: 8.0.16
-- PHP Version: 7.2.19-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `frea`
--

-- --------------------------------------------------------

--
-- Table structure for table `AccountRecord`
--

CREATE TABLE `AccountRecord` (
  `id` int(11) NOT NULL,
  `token` varchar(256) DEFAULT NULL,
  `name` varchar(256) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `password` varchar(256) DEFAULT NULL,
  `profile_photo` varchar(256) DEFAULT NULL,
  `points` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `MarkerRecord`
--

CREATE TABLE `MarkerRecord` (
  `id` int(11) NOT NULL,
  `author_id` int(11) DEFAULT '-1',
  `author` varchar(64) DEFAULT NULL,
  `title` varchar(24) DEFAULT NULL,
  `description` varchar(128) DEFAULT NULL,
  `longitude` double(10,6) NOT NULL DEFAULT '0.000000',
  `latitude` double(10,6) NOT NULL DEFAULT '0.000000',
  `picture` varchar(256) DEFAULT NULL,
  `category` varchar(256) DEFAULT NULL,
  `likes` json DEFAULT NULL,
  `created_date` bigint(20) DEFAULT '0',
  `expires` bigint(20) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `SerialRecord`
--

CREATE TABLE `SerialRecord` (
  `email` varchar(256) NOT NULL,
  `serial` int(11) DEFAULT '0',
  `expires` bigint(20) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AccountRecord`
--
ALTER TABLE `AccountRecord`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `MarkerRecord`
--
ALTER TABLE `MarkerRecord`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `SerialRecord`
--
ALTER TABLE `SerialRecord`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `AccountRecord`
--
ALTER TABLE `AccountRecord`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `MarkerRecord`
--
ALTER TABLE `MarkerRecord`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
