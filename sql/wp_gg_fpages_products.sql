-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-06-2018 a las 05:50:34
-- Versión del servidor: 10.1.32-MariaDB
-- Versión de PHP: 5.6.36

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `wordpress_development`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `wp_gg_fpages_products`
--

CREATE TABLE `wp_gg_fpages_products` (
  `prodID` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `pageID` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `name` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `decription` longtext CHARACTER SET utf8,
  `image` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `use_prod_name` tinyint(1) DEFAULT '1',
  `use_prod_description` tinyint(1) DEFAULT '1',
  `use_prod_image` tinyint(1) DEFAULT '1',
  `position` tinyint(3) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `wp_gg_fpages_products`
--

INSERT INTO `wp_gg_fpages_products` (`prodID`, `pageID`, `name`, `decription`, `image`, `use_prod_name`, `use_prod_description`, `use_prod_image`, `position`) VALUES
('AFTEIG200', 'P3', '', '', '', 1, 1, 1, 1),
('AFTEIG300', 'P3', '', '', '', 1, 1, 1, 2),
('AFTEIG400', 'P3', '', '', '', 1, 1, 1, 3);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
