panelProductos.controller( 'generalController', ['$scope', '$rootScope', '$http', 'tabsManagment', 'productsFactory', 'pagesFactory',
function($scope, $rootScope, $http, tabsManagment, productsFactory, pagesFactory){
    $scope.pagesFactory = pagesFactory;
    $scope.productsFactory = productsFactory;

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
            return !$scope.pagesFactory.loading && !$scope.productsFactory.loading && !$scope.errorsManager.checkForErrorsRunning
            && !$scope.errorsManager.errorOcurred ;
        },
        hideLoadingScreen: function(){
            var _this = this;
            setTimeout(function(){
                $(_this.loadingScreenSelector).fadeOut(400, function(){
                    _this.loadingScreenActivated = false;
                    $scope.$apply();
                });
            }, 2000);
        },
    };

    $scope.errorsManager = {
        errorOcurred: false,
        checkForErrorsRunning: false,
        errorsInformation: {
            noSecurePage: {
                description: "La pagina debe ser cargada en https://",
                solutionText: "Cargar en forma segura",
                check: function(){
                    return location.protocol != 'https:';
                },
                solution: function(){
                    location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
                },
            },
        },
        checkForErrors: function(){
            this.checkForErrorsRunning = true;
            var result = false;
            for(var errorName in this.errorsInformation) {
                if( this.errorsInformation[errorName].check() ){
                    this.errorOcurred = this.errorsInformation[errorName];
                    result = this.errorsInformation[errorName];
                    break;
                }
            }
            this.checkForErrorsRunning = false;
            return result;
        },
    }

    $scope.loadingManager.onLoading();
    console.log($scope);

}]);
