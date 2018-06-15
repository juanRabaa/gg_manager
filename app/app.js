'use strict';

var $ = jQuery.noConflict();
var panelProductos = angular.module('panelProductos', ['ngRoute', 'ui.materialize', "angucomplete-alt", 'ui.sortable'/*, 'ngAnimate'*/]);

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

panelProductos.config(['$routeProvider', '$locationProvider',
    function( $routeProvider, $locationProvider){
        $routeProvider
            .when('/', {
                templateUrl: wordpressData.pageCreatorUrl + '/views/edition-panel.php',
                controller: 'productoController'
            })
            .when('/pagination-panel', {
                templateUrl: wordpressData.pageCreatorUrl + '/views/edition-panel.php',
                controller: 'productoController'
            })
            .when('/products-panel', {
                templateUrl: wordpressData.pageCreatorUrl + '/views/products-managment-panel.php',
                controller: 'productsManagmentController'
            });
    }
]);

panelProductos.factory('httpRequestInterceptor', function () {
  return {
    request: function (config) {
      config.headers['X-WP-Nonce'] = wordpressData.nonce;
      //console.log(config);
      return config;
    }
  };
});


panelProductos.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
});

panelProductos.directive('skFadingCircle', function() {
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

panelProductos.directive("formOnChange", function($parse){
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
