panelProductos.controller( 'generalController', ['$scope', '$rootScope', '$http', 'tabsManagment', 'productsFactory', 'pagesFactory', 'errorsManager',
'statusManager', 'httpStatus', function($scope, $rootScope, $http, tabsManagment, productsFactory, pagesFactory, errorsManager, statusManager, httpStatus){
    $scope.pagesFactory = pagesFactory;
    $scope.productsFactory = productsFactory;
    $scope.errorsManager = errorsManager;
    $scope.statusManager = statusManager;
    $scope.httpStatus = httpStatus;

    $scope.loadingManager = {
        loadingScreenSelector: '#full-loading-screen',
        loadingScreenActivated: true,
        loading: true,
        loadingInterval: null,
        setLoadingInterval: function(){
            var _this = this;
            this.loading = true;
            this.loadingInterval = setInterval(function(){
                if( _this.essentialsReady() ){
                    _this.loading = false;
                    _this.clearLoadingInterval();
                };
            }, 100);
        },
        clearLoadingInterval: function(){
            clearInterval( this.loadingInterval );
        },
        onLoading: function(){
            this.setLoadingInterval();
            $scope.errorsManager.checkForErrors();
        },
        essentialsReady: function(){
            return !$scope.pagesFactory.loading && !$scope.productsFactory.loading && !$scope.errorsManager.checkingForErrors
            && !$scope.errorsManager.errorOcurred ;
        },
        hideLoadingScreen: function(){
            var _this = this;
            setTimeout(function(){
                $(_this.loadingScreenSelector).fadeOut(400, function(){
                    _this.loadingScreenActivated = false;
                    //$scope.$apply();
                });
            }, 2000);
        },
    };

    $scope.loadingManager.onLoading();


    console.log($scope);

}]);
