'use strict';

var $ = jQuery.noConflict();
var panelProductos = angular.module('panelProductos', ['ngRoute', 'ui.materialize', "angucomplete-alt", 'ui.sortable'/*, 'ngAnimate'*/]);

panelProductos.config(['$routeProvider', '$locationProvider',
    function( $routeProvider, $locationProvider){
        $routeProvider
            .when('/', {
                templateUrl: wordpressData.themeUrl + '/page-creator/views/edition-panel.php',
                controller: 'productoController'
            })
            .when('/pagination-panel', {
                templateUrl: wordpressData.themeUrl + '/page-creator/views/edition-panel.php',
                controller: 'productoController'
            })
            .when('/products-panel', {
                templateUrl: wordpressData.themeUrl + '/page-creator/views/products-managment-panel.php',
                controller: 'productsManagmentController'
            });
    }
]);

panelProductos.factory('httpRequestInterceptor', function () {
  return {
    request: function (config) {
      config.headers['X-WP-Nonce'] = wordpressData.nonce;
      console.log(wordpressData.nonce);
      return config;
    }
  };
});

panelProductos.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
});
