-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-06-2018 a las 05:50:43
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
-- Estructura de tabla para la tabla `wp_gg_pages`
--

CREATE TABLE `wp_gg_pages` (
  `ID` varchar(20) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `buttons_type` varchar(20) NOT NULL DEFAULT 'no_image',
  `page_type` varchar(20) NOT NULL DEFAULT 'category_page',
  `image` varchar(200) DEFAULT NULL,
  `description` longtext,
  `visibility` tinyint(1) NOT NULL DEFAULT '1',
  `position` int(11) DEFAULT NULL,
  `parent_ID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `wp_gg_pages`
--

INSERT INTO `wp_gg_pages` (`ID`, `name`, `buttons_type`, `page_type`, `image`, `description`, `visibility`, `position`, `parent_ID`) VALUES
('A0', 'Productos', 'no_image', 'base_page', NULL, NULL, 1, NULL, NULL),
('C1', 'Turroneria', 'side_image', 'category_page', NULL, 'Turrones y demas cosas', 1, 2, 'A0'),
('C2', 'Chocolates & delicatessen', 'side_image', 'category_page', NULL, 'La mostarda es una conserva típica italiana, un chutney, hecho con frutas enteras, azúcar, y esencia de mostaza. Son recetas con sabor muy intenso, que combina perfectamente con platos salados: carnes rojas y blancas, etc. También, se utiliza como ingrediente en algunas preparaciones como, por ejemplo, los tortelli di zucca (‘raviolis de calabaza’).', 1, 1, 'A0'),
('C3', 'Espumantes', 'huge_image', 'category_page', NULL, 'Buseca y vino tintoooo', 1, 3, 'A0'),
('C4', 'Vinos especiales', 'no_image', 'category_page', NULL, 'Testeando la descripcion', 1, 4, 'A0'),
('C6', 'Vinos', 'no_image', 'category_page', NULL, 'Testeando la descripcion', 0, 5, 'A0'),
('C7', 'Regaleria', 'no_image', 'category_page', NULL, 'Testeando la descripcion', 1, 6, 'A0');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `wp_gg_pages`
--
ALTER TABLE `wp_gg_pages`
  ADD PRIMARY KEY (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
