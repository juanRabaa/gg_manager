<?php
	//echo get_site_url(null, '', 'https');
?>
<script type="text/javascript">
	var templateUrl = '<?= get_site_url(null, '', 'https'); ?>';
</script>
<div id="gg-page-creator-panel" ng-app="panelProductos" ng-controller="generalController" >
	<div ng-class="{'error-ocurred': errorsManager.errorOcurred}" class="loading-animation ng-if-fade multicolor-background"
	ng-if="loadingScreenActivated">
		<div ng-if="esentialsReady()" ng-init="hideLoadingScreen()"></div>
        <div class="ng-cloak" ng-if="loadingScreenActivated && !errorsManager.errorOcurred">
            <h3 class="general-loading center">LOADING <span ng-if="!pagesFactory.loading && !productsFactory.loading" class="loading-done ng-if-height-5">DONE</span></h3>
			<p class="loading-data" ng-class="{complete: !pagesFactory.loading}">Loading pages tree... <span ng-if="!pagesFactory.loading" class="loading-done">DONE</span></p>
            <p class="loading-data" ng-class="{complete: !productsFactory.loading}">Loading products information... <span ng-if="!productsFactory.loading" class="loading-done">DONE</span></p>
        </div>
		<div class="loading-background-overlay"></div>
		<div class="ng-cloak loading-error" ng-if="loadingScreenActivated && errorsManager.errorOcurred">
            <h3 class="general-loading center">ERROR</h3>
			<p class="loading-data">{{errorsManager.errorOcurred.description}}</p>
			<div ng-click="errorsManager.errorOcurred.solution()" class="loading-button gg-green-background btn waves-effect waves-light">{{errorsManager.errorOcurred.solutionText}}</div>
        </div>
    </div>
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
