<?php
	//echo get_site_url(null, '', 'https');
?>
<script type="text/javascript">
	var templateUrl = '<?= get_site_url(null, '', 'https'); ?>';
</script>
<div id="gg-page-creator-panel" ng-app="panelProductos" ng-controller="generalController" >
	<div ng-class="{'error-ocurred': errorsManager.errorOcurred}" id="full-loading-screen" class="loading-animation ng-if-fade multicolor-background"
	ng-if="loadingManager.loadingScreenActivated">
		<div ng-if="!loadingManager.loading" ng-init="loadingManager.hideLoadingScreen()"></div>
        <div class="ng-cloak" ng-if="loadingManager.loadingScreenActivated && !errorsManager.errorOcurred">
            <h3 class="general-loading center">LOADING <span ng-if="!pagesFactory.loading && !productsFactory.loading" class="loading-done ng-if-height-5">DONE</span></h3>
			<p class="loading-data" ng-class="{complete: !pagesFactory.loading}">Loading pages tree... <span ng-if="!pagesFactory.loading" class="loading-done">DONE</span></p>
            <p class="loading-data" ng-class="{complete: !productsFactory.loading}">Loading products information... <span ng-if="!productsFactory.loading" class="loading-done">DONE</span></p>
        </div>
		<div class="loading-background-overlay"></div>
		<div class="ng-cloak loading-error" ng-if="loadingManager.loadingScreenActivated && errorsManager.errorOcurred">
            <h3 class="general-loading center">ERROR</h3>
			<p class="loading-data center">{{errorsManager.errorOcurred.description}}</p>
			<p ng-if="errorsManager.errorOcurred.reason" class="loading-data">{{errorsManager.errorOcurred.reason}}</p>
			<p ng-if="!errorsManager.errorOcurred.solution" class="loading-data">{{errorsManager.errorOcurred.solutionText}}</p>
			<div ng-if="errorsManager.errorOcurred.solution" ng-click="errorsManager.errorOcurred.solution()" class="loading-button gg-green-background btn waves-effect waves-light">{{errorsManager.errorOcurred.solutionText}}</div>
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
	<div id="gg-saving-bar">
		<sk-fading-circle ng-if="statusManager.savingToDB"></sk-fading-circle>
		<i ng-if="!statusManager.savingToDB" class="fas fa-check gg-golden-color"></i>
		<div class="info">
			<span ng-repeat="postRequest in httpStatus.postQueue">
				{{postRequest.savingNiceInfo}}<span ng-if="!$last">, </span>
			</span>
		</div>
	</div>
</div>
</div>
