<?php
	echo get_site_url(null, '', 'https');
?>
<script type="text/javascript">
	var templateUrl = '<?= get_site_url(null, '', 'https'); ?>';
</script>
<div id="gg-page-creator-panel" ng-app="panelProductos">
	<div id="header">
		<h1> Page Creator </h1>
	</div>
    <div id="gg-page-creator-main">
		<div id="gg-panel-tabs" class="row">
		      <ul class="tabs z-depth-1">
		        <li class="tab col s6">
					<a ng-class="{active: activatedTab == 'paginationController'}" href="#!pagination-panel">Paginas</a>
				</li>
		        <li class="tab col s6">
					<a ng-class="{active: activatedTab == 'productsManagmentController'}" href="#!products-panel">Productos</a>
				</li>
		      </ul>
		</div>
		<div id="gg-ng-view" ng-view>
		</div>
	</div>
</div>
</div>
