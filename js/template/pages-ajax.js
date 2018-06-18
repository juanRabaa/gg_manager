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
            console.log(elem, idx);
            if( funct(elem) ){
                console.log("Es este!");
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
    $scope.pagesTree = {};

    $scope.loadingManager = {
        tickets: [],
        startLoading: function(description){
            console.log(description);
            var ticketID = "loading_ticket_n_" + this.tickets.length;
            this.tickets.push({
                ID: ticketID,
                description: description,
            });
            return ticketID;
        },
        endLoading: function(ticketID){
            //this.tickets.findAndRemove(ticket => ticket.ID == ticketID );console.log(this);
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

    $scope.saveCurrentPage = function(){
        $scope.savePageInTrunk($scope.currentPage);
        $scope.savePageButtons($scope.currentPage.ID, $scope.currentButtons);
    };

    //Loads the base page buttons(categories and final pages).
    $scope.loadBasePageButtons = function(){
        var loadingTicket = $scope.loadingManager.startLoading("Loading base page buttons");
        var promise = $http.get(wordpressData.siteUrl + '/wp-json/gg/v1/pages/get/base_page');
        promise.then(function(result){
            if(result.data){
                $scope.changeToPage(result.data);
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
    $scope.changeToPage = function(page){
        $scope.currentPage = page;
        console.log("Changing to", page);
        $scope.updateCurrentButtons();
    };

    $scope.getPageContent = function(page){
        var loadingTicket = $scope.loadingManager.startLoading("Getting content for " + page.name);
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
            var loadingTicket = $scope.loadingManager.startLoading("Updating buttons");
            var pageContentPromise = $scope.getPageContent($scope.currentPage);
            pageContentPromise.then(function(result){
                console.log(result);
                $scope.currentButtons = result.data;
                $scope.saveCurrentPage();
                $scope.loadingManager.endLoading(loadingTicket);
            });
        }
    }

    $scope.getPageByID = function(pageID){
        //product has been loaded already
        if ($scope.pagesTrunk[pageID])
            return $scope.pagesTrunk[pageID];

        var loadingTicket = $scope.loadingManager.startLoading("Getting page info of " + pageID);
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
