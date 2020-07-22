-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 22-Jul-2020 às 04:41
-- Versão do servidor: 10.1.34-MariaDB
-- PHP Version: 7.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Estrutura da tabela `dados_aqns`
--

CREATE TABLE `dados_aqns` (
  `AQNS` double NOT NULL,
  `Modelo` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `Atributo` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `Poco` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `id_identificacao` int(10) NOT NULL,
  `ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Estrutura da tabela `identificacao`
--

CREATE TABLE `identificacao` (
  `Versao` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `Data` datetime NOT NULL,
  `Iteracao` int(11) NOT NULL,
  `ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Indexes for dumped tables
--

--
-- Indexes for table `dados_aqns`
--
ALTER TABLE `dados_aqns`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `fk_identificacao` (`id_identificacao`);

--
-- Indexes for table `identificacao`
--
ALTER TABLE `identificacao`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dados_aqns`
--
ALTER TABLE `dados_aqns`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=263358;

--
-- AUTO_INCREMENT for table `identificacao`
--
ALTER TABLE `identificacao`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `dados_aqns`
--
ALTER TABLE `dados_aqns`
  ADD CONSTRAINT `fk_identificacao` FOREIGN KEY (`id_identificacao`) REFERENCES `identificacao` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
