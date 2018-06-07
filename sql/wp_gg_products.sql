-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-06-2018 a las 05:50:48
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
-- Estructura de tabla para la tabla `wp_gg_products`
--

CREATE TABLE `wp_gg_products` (
  `ID` varchar(20) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  `price_pesos` float DEFAULT NULL,
  `description` longtext,
  `enabled` tinyint(1) DEFAULT NULL,
  `parent_product_ID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `wp_gg_products`
--

INSERT INTO `wp_gg_products` (`ID`, `name`, `image`, `price_pesos`, `description`, `enabled`, `parent_product_ID`) VALUES
('AFTEIG200', 'After Eight 200', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/After_20eight_203_large.png', NULL, '', 1, 'AFTEIG200'),
('AFTEIG300', 'After Eight 300', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/Caja-After-Eight.png', NULL, '', 1, 'AFTEIG200'),
('AFTEIG400', 'After Eight 400', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/imagen.png', NULL, '', 1, 'AFTEIG200'),
('AMAMONT', 'Amaro Montenegro', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/05/Amaro-Montenegro.png', 58587, '', 1, NULL),
('BIANCBOX', 'Bianconero', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/Bianconero-box.png', NULL, 'Soy muy rico mmm', 0, 'AFTEIG200'),
('CHOCAOTIR', 'Chocao Tiramisu', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/Chocao-tiramisu-125g-bag.png', NULL, '', 1, NULL),
('CHOCCREM', 'Chococremino', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/Chococremino-box.png', NULL, '', 1, NULL),
('LAMODBIANCO', 'Aceto Balsamico Bianco', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/05/Aceto-balsamico-di-Modena-Blanco-IGP.png', NULL, '', 1, NULL),
('LOLIPOP', 'Chupetin', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/92962130_KAagard_IWantCandy_Lollipop2A.png', 88, 'Es un chupetin, rojo', 1, NULL),
('VERGBOERO', 'Boero', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/Boero-100g-bag.png', NULL, '', 1, NULL),
('VERGGIANDUI', 'Gianduiotti', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/Gianduiotti-130g-bag.png', NULL, '', 1, NULL),
('VERGOLIMPO', 'Olimpo', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/Olimpo.png', NULL, '', 1, NULL),
('VERGTARTUFO', 'Tartufo', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/Tartufo.png', NULL, '', 1, NULL),
('VERGTINMILANO', 'Milano', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/MILANO-tin-box.png', NULL, '', 1, NULL),
('VERGTINROMA', 'Roma', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/ROMA-tin-box.png', NULL, '', 1, NULL),
('VERILFONDENTE', 'Il Fondete', 'http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/Il-Fondente-box.png', NULL, '', 1, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `wp_gg_products`
--
ALTER TABLE `wp_gg_products`
  ADD PRIMARY KEY (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
