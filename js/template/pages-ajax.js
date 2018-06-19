'use strict';

var $ = jQuery.noConflict();
var ggPagesNavigation = angular.module('ggPagesNavigation', ['ngRoute', /*, 'ngAnimate'*/]);


// ggPagesNavigation.factory('httpRequestInterceptor', function () {
//   return {
//     request: function (config) {
//       config.headers['X-WP-Nonce'] = wordpressData.nonce;
//       //console.log(config);
//       return config;
//     }
//   };
// });
//
//
// ggPagesNavigation.config(function ($httpProvider) {
//   $httpProvider.interceptors.push('httpRequestInterceptor');
// });

function findAndRemove( arr, funct ){
    var index = false;
    var result = null;
    arr.find(function(elem, idx){
        if( funct(elem) ){
            index = idx;
            result = elem;
            return true;
        }
        return false
    });
    if ( result )
        arr.splice(index, 1);
}

if (!Array.prototype.findAndRemove) {
    Array.prototype.findAndRemove = function(funct) {
        var index = false;
        var result = null;
        this.find(function(elem, idx){
            if( funct(elem) ){
                index = idx;
                result = elem;
                return true;
            }
            return false
        });
        if ( result )
            this.splice(index, 1);
        return result;
    }
}

ggPagesNavigation.directive('skFadingCircle', function() {
    return {
        restrict: 'EA',
        replace: false,
        template:
            '<div class="sk-fading-circle">'
            +  '<div class="sk-circle1 sk-circle"></div>'
            +  '<div class="sk-circle2 sk-circle"></div>'
            +  '<div class="sk-circle3 sk-circle"></div>'
            +  '<div class="sk-circle4 sk-circle"></div>'
            +  '<div class="sk-circle5 sk-circle"></div>'
            +  '<div class="sk-circle6 sk-circle"></div>'
            +  '<div class="sk-circle7 sk-circle"></div>'
            +  '<div class="sk-circle8 sk-circle"></div>'
            +  '<div class="sk-circle9 sk-circle"></div>'
            +  '<div class="sk-circle10 sk-circle"></div>'
            +  '<div class="sk-circle11 sk-circle"></div>'
            +  '<div class="sk-circle12 sk-circle"></div>'
            +'</div>'
    };
});

ggPagesNavigation.directive('skCubeGrid', function() {
    return {
        restrict: 'EA',
        replace: false,
        template:
        '<div class="sk-cube-grid">'
        + ' <div class="sk-cube sk-cube1"></div>'
        +  '<div class="sk-cube sk-cube2"></div>'
        +  '<div class="sk-cube sk-cube3"></div>'
        +  '<div class="sk-cube sk-cube4"></div>'
        +  '<div class="sk-cube sk-cube5"></div>'
        +  '<div class="sk-cube sk-cube6"></div>'
        +  '<div class="sk-cube sk-cube7"></div>'
        +  '<div class="sk-cube sk-cube8"></div>'
        +  '<div class="sk-cube sk-cube9"></div>'
        +'</div>'
    };
});

ggPagesNavigation.directive("formOnChange", function($parse){
  return {
    require: "form",
    scope: {
        bindedModel: "=ngModel"
    },
    link: function(scope, element, attrs){
       var cb = scope.$parent[attrs.formOnChange];
       angular.getTestability(element).whenStable(function() {
           element.on("change", function(){
              cb(scope.bindedModel);
           });
       });
    }
  }
});

ggPagesNavigation.factory('pagesFactory', ['$http', '$q', function($http, $q) {
    var pagesFactory = {}
    return pagesFactory;
}]);

ggPagesNavigation.controller( 'pagesNavigation', ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout){
    $scope.basePage = {};
    $scope.currentButtons = [];
    $scope.currentPage = {};
    $scope.currentProducts = [];
    $scope.loading = false;
    $scope.error = null;
    //Stores pages information
    $scope.pagesTrunk = [];
    //Stores the buttons of loaded pages. [ID => [Childrens]]
    $scope.pagesButtons = [];
    //Stores the products of loaded pages. [ID => [Childrens]]
    $scope.pagesProducts = [];
    $scope.pagesTree = {};

    $scope.loadingManager = {
        tickets: [],
        history: [],
        isLoading: function(){
            return this.tickets.length > 0;
        },
        startLoading: function(description){
            console.log(description);
            var ticketID = "loading_ticket_n_" + this.tickets.length;
            this.tickets.push({
                ID: ticketID,
                description: description,
            });
            this.history.push(description);
            return ticketID;
        },
        endLoading: function(ticketID){
            return this.tickets.findAndRemove(ticket => ticket.ID == ticketID );
        },
        getTicket: function(ticketID){
            return this.tickets.find(ticket => ticket.ID == ticketID );
        },
    }

    //If the page information isnt in the pagesTrunk, then it saves it there
    //This will avoid making a GET request for a page that has already been loaded
    $scope.savePageInTrunk = function(page){
        if ( !$scope.pagesTrunk[page.ID] )
            $scope.pagesTrunk[page.ID] = page;
    };

    $scope.savePageButtons = function(pageID, buttons){
        if ( !$scope.pagesButtons[pageID] )
            $scope.pagesButtons[pageID] = buttons;
    };

    $scope.savePageProducts = function(pageID, products){
        if ( !$scope.pagesProducts[pageID] )
            $scope.pagesProducts[pageID] = products;
    };

    $scope.saveCurrentPage = function(){
        $scope.savePageInTrunk($scope.currentPage);
        if ( $scope.currentPage.page_type != "final_page" )
            $scope.savePageButtons($scope.currentPage.ID, $scope.currentButtons);
        else
            $scope.savePageProducts($scope.currentPage.ID, $scope.currentProducts);
    };

    //Loads the base page buttons(categories and final pages).
    $scope.loadBasePageButtons = function(){
        var loadingTicket = $scope.loadingManager.startLoading("Cargando paginas principales");
        var promise = $http.get(wordpressData.siteUrl + '/wp-json/gg/v1/pages/get/base_page');
        promise.then(function(result){
            if(result.data){
                $scope.changeToPage(result.data, loadingTicket);
            }
            $scope.loadingManager.endLoading(loadingTicket);
        }).catch(function(e){
            $scope.error = e;
            console.log(e);
            $scope.loadingManager.endLoading(loadingTicket);
        });
        return promise;
    };

    // $scope.loadBasePage = function(){
    //     var loadingTicket = $scope.loadingManager.startLoading("Loading base page");
    //     var promise = $http.get(wordpressData.siteUrl + '/wp-json/gg/v1/pages/get/first_order')
    //     promise.then(function(result){
    //         if(result.data){
    //             result.data.forEach(page => $scope.savePageInTrunk(page));
    //             $scope.currentButtons = result.data;
    //         }
    //         $scope.loadingManager.endLoading(loadingTicket);
    //     }).catch(function(e){
    //         $scope.error = e;
    //         console.log(e)
    //         $scope.loadingManager.endLoading(loadingTicket);
    //     });
    //     return promise;
    // };

    //Change the current content to the one of the given page
    $scope.changeToPage = function(page, loadingTicketID){
        if(!$scope.loadingManager.isLoading() || (loadingTicketID && $scope.loadingManager.getTicket(loadingTicketID))){
            $scope.currentPage = page;
            console.log("Changing to", page);
            if( $scope.currentPage.page_type == "final_page")
                $scope.updateCurrentProducts();
            else
                $scope.updateCurrentButtons();
        }
        else {
            console.log("No puedo cambiar de pagina. Todavia se esta cargando otro contenido");
        }
    };

    $scope.getPageContent = function(page){
        var loadingTicket = $scope.loadingManager.startLoading("Buscando el contenido de " + page.name);
        var promise = $http.get(wordpressData.siteUrl + '/wp-json/gg/v1/pages/get/childs/' + page.ID)
        promise.then(function(result){
            if(result.data)
                result.data.forEach(child => child.parentPageObject = page);
            $scope.loadingManager.endLoading(loadingTicket);
        }).catch(function(e){
            $scope.error = e;
            console.log(e);
            $scope.loadingManager.endLoading(loadingTicket);
        });
        return promise;
    };

    $scope.goBack = function(){
        var pageID = $scope.currentPage.parent_ID;
        var pageInfoPromise = $scope.getPageByID(pageID);
        console.log(pageInfoPromise);
        //Si devolvio una pagina
        if ( pageInfoPromise.ID ){
            console.log("La pagina estaba guardada");
            $scope.changeToPage(pageInfoPromise);
        }
        else{
            console.log("La pagina no estaba guardada");
            pageInfoPromise.then(function(result){
                console.log(result);
                $scope.changeToPage(result.data);
            });
        }
    };

    $scope.updateCurrentButtons = function(){
        console.log("---Updatin current buttons---");
        if ($scope.pagesButtons[$scope.currentPage.ID]){
            $scope.currentButtons = $scope.pagesButtons[$scope.currentPage.ID];
        }
        else{
            var loadingTicket = $scope.loadingManager.startLoading("Actualizando los botones de la pagina");
            var pageContentPromise = $scope.getPageContent($scope.currentPage);
            pageContentPromise.then(function(result){
                console.log(result);
                $scope.currentButtons = result.data;
                $scope.saveCurrentPage();
                $scope.loadingManager.endLoading(loadingTicket);
            });
        }
    }

    $scope.updateCurrentProducts = function(){
        console.log("---Updating current products---");
        if ($scope.pagesProducts[$scope.currentPage.ID]){
            $scope.currentProducts = $scope.pagesProducts[$scope.currentPage.ID];
        }
        else{
            var loadingTicket = $scope.loadingManager.startLoading("Actualizando los productos");
            var pageProductsPromise = $scope.getPageProducts($scope.currentPage);
            pageProductsPromise.then(function(result){
                console.log(result);
                $scope.currentProducts = result.data;
                $scope.saveCurrentPage();
                $scope.loadingManager.endLoading(loadingTicket);
            });
        }
    }

    $scope.sanitizePageProduct = function(pageProduct){
        function stablishProductInformation(pageProduct){
            if(pageProduct.use_prod_name == true)
                pageProduct.name = pageProduct.productInfo.name;
            if(pageProduct.use_prod_description == true)
                pageProduct.description = pageProduct.productInfo.description;
            if(pageProduct.use_prod_image == true)
                pageProduct.image = pageProduct.productInfo.image;
            console.log("Product after sanitation: ", pageProduct);
        }

        if( pageProduct.productInfo ){//Si tiene la informacion real del producto
            stablishProductInformation(pageProduct);
        }
        else{//Si no tiene la informacion original del producto, la buscamos
            $scope.getProductInfo(pageProduct.prodID).then(function(result){
                if(result.data){
                    pageProduct.productInfo = result.data;
                    stablishProductInformation(pageProduct);
                }
            });
        }
    };

    $scope.getPageProducts = function(page){
        var loadingTicket = $scope.loadingManager.startLoading("Buscando los productos de " + page.name);
        var promise = $http.get(wordpressData.siteUrl + '/wp-json/gg/v1/fpages/get/parent/' + page.ID)
        promise.then(function(result){
            if(result.data.length > 0){//Si se encontraron productos
                console.log(result.data);
                result.data.forEach(function(pageProduct){//A cada producto le agregamos su pagina para proder acceder desde el objeto
                    pageProduct.parentPageObject = page;
                    $scope.getProductInfo(pageProduct.prodID).then(function(result){
                        if(result.data){
                            pageProduct.productInfo = result.data;
                            console.log("Product before sanitation: ", pageProduct);
                            $scope.sanitizePageProduct(pageProduct);
                        }
                        $scope.loadingManager.endLoading(loadingTicket);
                    });
                });
            }
            else//si no se encontraron productos
                $scope.loadingManager.endLoading(loadingTicket);
        }).catch(function(e){
            $scope.error = e;
            console.log(e);
            $scope.loadingManager.endLoading(loadingTicket);
        });
        return promise;
    };

    $scope.getProductInfo = function(productID){
        var loadingTicket = $scope.loadingManager.startLoading("Buscando la informacion del producto " + productID);
        var promise = $http.get(wordpressData.siteUrl + '/wp-json/gg/v1/products/get/id/' + productID)
        promise.then(function(result){
            console.log(result);
            $scope.loadingManager.endLoading(loadingTicket);
        }).catch(function(e){
            $scope.error = e;
            console.log(e);
            $scope.loadingManager.endLoading(loadingTicket);
        });
        return promise;
    };

    $scope.getPageByID = function(pageID){
        //product has been loaded already
        if ($scope.pagesTrunk[pageID])
            return $scope.pagesTrunk[pageID];

        var loadingTicket = $scope.loadingManager.startLoading("Buscando la informacion de la pagina " + pageID);
        var promise = $http.get(wordpressData.siteUrl + '/wp-json/gg/v1/pages/get/id/' + pageID)
        promise.then(function(result){
            $scope.loadingManager.endLoading(loadingTicket);
        }).catch(function(e){
            $scope.error = e;
            console.log(e);
            $scope.loadingManager.endLoading(loadingTicket);
        });
        return promise;
    };

    $scope.main = function(){
        $scope.loadBasePageButtons();
        console.log(":)")
    };


    $scope.main();


    console.log($scope);
















}]);
