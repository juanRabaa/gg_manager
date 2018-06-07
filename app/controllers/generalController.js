panelProductos.controller( 'generalController', ['$scope', '$rootScope', '$http', 'tabsManagment', 'productsFactory', 'pagesFactory',
function($scope, $rootScope, $http, tabsManagment, productsFactory, pagesFactory){
    $scope.pagesFactory = pagesFactory;
    $scope.productsFactory = productsFactory;
    $scope.loadingScreenActivated = true;

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

    $scope.onLoading = function(){
        $scope.errorsManager.checkForErrors();
    }

    $scope.esentialsReady = function(){
        return !$scope.pagesFactory.loading && !$scope.productsFactory.loading && !$scope.errorsManager.checkForErrorsRunning
        && !$scope.errorsManager.errorOcurred ;
    }

    $scope.hideLoadingScreen = function(){
        setTimeout(function(){ $scope.loadingScreenActivated = false; $scope.$apply(); }, 2000);
    }

    $scope.onLoading();
    console.log($scope);

}]);
