<?php
$gg_database_manager = $GLOBALS["gg_database_manager"];
print_r($gg_database_manager);
$pages = $gg_database_manager->get_pages();
?>
<div class="products-buttons">
	<a class="golden-button" href="http://localhost/wordpress2/htdocs/productos/turroneria/">
		<span class="golden-button-text">TURRONERÍA</span>
	</a>
	<a class="golden-button" href="http://localhost/wordpress2/htdocs/front-alternativo/">
		<span class="golden-button-text">CHOCOLATES &amp; DELICATESSEN</span>
	</a>
</div>
<?php
?>
