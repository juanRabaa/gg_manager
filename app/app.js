'use strict';

var $ = jQuery.noConflict();
var panelProductos = angular.module('panelProductos', ['ngRoute', 'ui.materialize', "angucomplete-alt", 'ui.sortable', 'ngAnimate']);

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

panelProductos.factory('tabsManagment', function() {
    var factory = {
        activatedTab: '',
        activateTab: function ( $rootScope, name ) {
            $rootScope.activatedTab = name;
            console.log(name);
        },
    }
    return factory;
});

panelProductos.factory('productsFactory', function($http) {
    var productsFactory = {
        products: [],
        loading: true,
        //Gets the products from the DB and store them in the products var
        updateProducts: function () {
            this.loading = true;
            /*this.products = [
                {
                    ID: 'AFTEIG200',
                    name: "After Eight 200 gramos",
                    image: "https://www.madewithnestle.ca/sites/default/files/after_eight_300g_1.png",
                    price_pesos: 60,
                    description: "Descripcion de los After Eight de 200 gramos. Son ricos :)",
                    enabled: true,
                    prodPadre: '',
                    webVisibility: true,
                },
                {
                    ID: 'AFTEIG300',
                    name: "After Eight 300 gramos",
                    image: "http://galagourmet.com.ar/wp-content/uploads/2016/09/Caja-After-Eight.png",
                    price_pesos: 70,
                    description: "Aca se describen los de 300 gramos.",
                    prodPadre: 'AFTEIG200',
                    enabled: true,
                    webVisibility: true,
                },
                {
                    ID: 'AFTEIG400',
                    name: "After Eight 400 gramos",
                    image: "https://www.nestleprofessional.es/sites/g/files/gfb231/f/styles/product/public/media/aftereight-adaptada.png?itok=gJfenTsl",
                    description: "Y aca esta la descripcion de los de 400",
                    price_pesos: 80,
                    prodPadre: 'AFTEIG200',
                    enabled: true,
                    webVisibility: true,
                },
                {
                    ID: 'AERBUBBMINT',
                    name: "Aero Bubble mint",
                    image: "https://www.nestleprofessional.co.uk/sites/g/files/gfb191/f/styles/product/public/media/3.3b_aero_mint_bubbles_angle.png?itok=aIlGb1Tu",
                    price_pesos: 60,
                    description: "Descripcion. Son ricos :)",
                    disabled: true,
                    prodPadre: '',
                    webVisibility: true,
                },
                {
                    ID: 'AERMINTBARR',
                    name: "Aero Mint barra",
                    image: "http://cdn.shopify.com/s/files/1/1271/3197/products/Mint_Aero_1_grande.png?v=1463340413",
                    price_pesos: 60,
                    description: "Descripcion. Son ricos :)",
                    enabled: true,
                    prodPadre: '',
                    webVisibility: true,
                },
                {
                    ID: 'AEROBUBBCLAS',
                    name: "Aero bubbles",
                    image: "https://www.jeancoutu.com/catalog-images/836734/viewer/0/nestle-aero-bubbles-pouch-milk-135-g.png",
                    price_pesos: 60,
                    description: "Son ricos :)",
                    enabled: true,
                    prodPadre: '',
                    webVisibility: true,
                },
                {
                    ID: 'AEROBARRCLAS',
                    name: "Aero Barra",
                    image: "https://www.madewithnestle.ca/sites/default/files/aero_milk_42_g.png",
                    price_pesos: 60,
                    description: "Son ricos :)",
                    enabled: true,
                    prodPadre: '',
                    webVisibility: true,
                },
                {
                    ID: 'BOMBVERGSAMB',
                    name: "Bombones Vergani Sambuca",
                    image: "http://galagourmet.com.ar/wp-content/uploads/2017/05/Vergani-praline-crema-Sambuca.png",
                    price_pesos: 60,
                    description: "Son ricos :)",
                    enabled: true,
                    prodPadre: '',
                    webVisibility: true,
                },
                {
                    ID: 'BOMBVERGRUM',
                    name: "Bombones Vergani Rum",
                    image: "http://galagourmet.com.ar/wp-content/uploads/2017/05/Vergani-praline-rum.png",
                    price_pesos: 60,
                    description: "Son ricos :)",
                    enabled: true,
                    prodPadre: '',
                    webVisibility: true,
                },
                {
                    ID: 'BOMBVERGCREMWSK',
                    name: "Bombones Vergani Crema Whisky",
                    image: "http://galagourmet.com.ar/wp-content/uploads/2017/05/Vergani-praline-crema-whisky.png",
                    price_pesos: 60,
                    description: "Son ricos :)",
                    enabled: true,
                    prodPadre: '',
                    webVisibility: true,
                },
                {
                    ID: 'BOMBVERGLIMON',
                    name: "Bombones Vergani Limoncello",
                    image: "http://galagourmet.com.ar/wp-content/uploads/2017/05/Vergani-praline-limoncello.png",
                    price_pesos: 60,
                    description: "Son ricos :)",
                    enabled: true,
                    prodPadre: '',
                    webVisibility: true,
                },
            ];
            */
            var _this = this;
            $http.get(templateUrl + '/wp-json/gg/v1/products/get/all').then(function(result){
                _this.products = result.data;
                _this.loading = false;
                console.log(_this);
            });
        },
        amountOfProducts: function(){
            return this.products.length;
        },
        //Returns all the products
        getAllProducts: function(){
            return this.products;
        },
        getProductByID: function( productID, callback ){
            var wantedProduct = null;
            var index;

            this.products.find(function( product, idx ){
                if ( product.ID == productID ){
                    index = idx;
                    wantedProduct = product;
                    return true;
                }
                return false;
            });

            if( callback )
                callback( wantedProduct, index, this.products );

            return wantedProduct;
        },
        //Remove a product from the DB and the products array
        removeProduct: function( productID ){
            var productsFactory = this;
            $http.post(templateUrl + '/wp-json/gg/v1/products/delete', {ID: productID}).then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    productsFactory.getProductByID( productID, function( wantedProduct, index ){
                        productsFactory.products.splice(index, 1);
                    });
                    Materialize.toast(product.name + " eliminado!", 5000);
                }
                else
                    Materialize.toast("Error al eliminar producto: " + result.data.last_error, 10000);
                console.log(result);
            });
        },
        //Add product to DB and array
        addProduct: function( product ){
            //VALIDATE PRODUCT?
            var _this = this;
            $http.post(templateUrl + '/wp-json/gg/v1/products/add', product).then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    _this.products.push(product);
                    Materialize.toast(product.name + " agregado!", 5000);
                }
                else
                    Materialize.toast("Error al agregar producto: " + result.data.last_error, 10000);
                console.log(result);
            });
            console.log(product);
        },
        editProduct: function( newProductData ){
            var _this = this;
            console.log("New Data: ", newProductData);
            $http.post(templateUrl + '/wp-json/gg/v1/products/edit', newProductData, {
                headers: {'X-WP-Nonce': wpApiSettings.nonce}
            }).then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    _this.getProductByID( newProductData.ID, function( oldProduct, index, array ){
                        Object.assign(oldProduct, newProductData);
                    });
                    Materialize.toast(newProductData.name + " editado correctamente!", 5000);
                }
                else
                    Materialize.toast("Error al editar producto: " + result.data.last_error, 10000);
                console.log(result);
            });
        },
    };
    productsFactory.updateProducts();

    return productsFactory;
});

panelProductos.factory('pagesFactory', function($http) {
    var pagesFactory = {
        pages: [],
        loading: true,
        updatePages: function(){
            this.loading = true;
            var _this = this;
            $http.get(templateUrl + '/wp-json/gg/v1/pages/get/all').then(function(result){
                _this.pages = result.data;
                _this.loading = false;
                console.log(_this);
            });
        },
        getPageChilds: function( page ){
            var pages = [];
            if ( page.pageType != "final_page" ){
                console.log(this);
                pages = this.pages.filter(function( filtPage, idx ){
                    if ( filtPage.parent_ID == page.ID )
                        return true;
                    return false;
                });
            }
            return pages;
        },
        getPageByID: function( pageID, callback ){
            var wantedPage = null;
            var index;

            this.pages.find(function( page, idx ){
                if ( page.ID == pageID ){
                    index = idx;
                    wantedPage = page;
                    return true;
                }
                return false;
            });

            if( callback )
                callback( wantedPage, index, this.pages );

            return wantedPage;
        },
        editPage: function( newPageData ){
            var _this = this;
            console.log("New Data: ", newPageData);
            $http.post(templateUrl + '/wp-json/gg/v1/pages/edit', newPageData)
            .then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    _this.getPageByID( newPageData.ID, function( oldPage, index, array ){
                        Object.assign(oldPage, newPageData);
                    });
                    Materialize.toast(newPageData.name + " editado correctamente!", 5000);
                }
                else
                    Materialize.toast("Error al editar pagina: " + result.data.last_error, 10000);
                console.log(result);
            });
        },
        addPage: function( page ){
            var _this = this;
            $http.post(templateUrl + '/wp-json/gg/v1/pages/add', page).then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    _this.pages.push(page);
                    Materialize.toast(page.name + " agregada!", 5000);
                }
                else
                    Materialize.toast("Error al agregar la pagina: " + result.data.last_error, 10000);
                console.log(result);
            });
        },
        removePage: function( page ){
            var pagesFactory = this;
            $http.post(templateUrl + '/wp-json/gg/v1/pages/delete', page).then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    pagesFactory.getPageByID( page.ID, function( wantedPage, index ){
                        pagesFactory.pages.splice(index, 1);
                    });
                    Materialize.toast(page.name + " eliminado!", 5000);
                }
                else
                    Materialize.toast("Error al eliminar la pagina: " + result.data.last_error, 10000);
                console.log(result);
            });
        },
    };

    pagesFactory.updatePages();
    return pagesFactory;
});

panelProductos.directive('rbWpGallery', [function() {
  function link($scope, $element, attrs) {
      $scope.label = attrs.rbWpGalleryName ? attrs.rbWpGalleryName : "Image";
      $scope.placeholder = attrs.rbWpGalleryPlaceholder ? attrs.rbWpGalleryPlaceholder : "";
      $scope.onImageChanged = attrs.rbWpGalleryOnImageChange;
      console.log($scope.placeholder);
      $scope.ngModel = $scope.ngModel ? $scope.ngModel : $scope.placeholder;
      $scope.button = attrs.rbWpGalleryButton ? attrs.rbWpGalleryButton : "Choose from gallery";
      $scope.disabled = attrs.disabled != undefined ? true : false;
      $scope.class = "";
      $scope.dragNdrop = {
          status: 'noDrag',

      }

      if ( $scope.disabled )
        $scope.class += "rb-disabled-gallery ";

      $scope.imageChanged = function(){
          if (typeof $scope.onImageChanged === "function")
              $scope.onImageChanged($scope.ngModel);
      }

      $scope.openGallery = function(){
          //console.log("Opening gallery");
          var custom_uploader = wp.media.frames.file_frame = wp.media({
              title: 'Agregar imagen',
              button: {
                  text: 'Agregar imagen',
              },
              multiple: false,
          });
          custom_uploader.on('select', function() {
              var newSrc = custom_uploader.state().get('selection').first().changed.url;
              //console.log("New image: ", newSrc);
              $scope.ngModel = newSrc;
              //console.log($scope.ngModel);
              $scope.imageChanged();
              $scope.$apply();
          });
          custom_uploader.open();
      }

      var counter = 0;

      $(document).on('dragenter', function(){
            $scope.dragPosition = "drag-screen";
      });

      $element.bind({
          dragenter: function(ev) {
              $scope.dragPosition = "drag-element";
          },
          dragover: function(ev) {
              $scope.dragPosition = "drag-element";
          },
          dragleave: function() {
              $scope.dragPosition = "drag-outside";
          },
          drop: function(ev){
              ev.preventDefault();
              console.log(ev);
          },
      });

      /*console.log(1);
      var json = JSON.parse(attrs.rbAttr);
      console.log(json);
      for (var attribute in attrs.rbAttr) {
          if (attrs.rbAttr.attribute) {
              $element.attr(attribute, '');
          }
      }*/
  }

  return {
    scope: {
        ngModel: '=',
    },
    link: link,
    template:
     '<div class="row product-local-image-holder {{class}}" ng-class="dragPosition">'
     +    '<div ng-if="" class="drop-placeholder"></div>'
      +   '<label>{{label}}</label>'
        +  '<div class="wp-gallery-trigger">'
        +      '<input hidden ng-model="ngModel" class="wp-gallery-image-input">'
        +      '<div class="wp-gallery-current-image">'
        +          '<img ng-if="!ngModel"class="responsive-img" src="{{placeholder}}">'
        +          '<img ng-if="ngModel" class="responsive-img" src="{{ngModel}}">'
        +          '<span ng-if="!ngModel && !placeholder" class="simple-placeholder" src="{{ngModel}}">Seleccione una imagen</span>'
        +      '</div>'
        +      '<div ng-if="!disabled" ng-click="openGallery()" class="wp-gallery-open-button gg-green-background btn waves-effect waves-light">'
        +          '<span>{{button}}</span>'
        +      '</div>'
        + '</div>'
      +'</div>',
  };
}]);

panelProductos.directive('slideable', function () {
    return {
        restrict:'C',
        compile: function (element, attr) {
            // wrap tag
            var contents = element.html();
            element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

            return function postLink(scope, element, attrs) {
                // default properties
                attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
                    'height': '0px',
                    'transitionProperty': 'height',
                    'transitionDuration': attrs.duration,
                    'transitionTimingFunction': attrs.easing
                });
            };
        }
    };
}).directive('slideToggle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var target = document.querySelector(attrs.slideToggle);
            attrs.expanded = false;
            element.bind('click', function() {
                var content = target.querySelector('.slideable_content');
                if(!attrs.expanded) {
                    content.style.border = '1px solid rgba(0,0,0,0)';
                    var y = content.clientHeight;
                    content.style.border = 0;
                    target.style.height = y + 'px';
                } else {
                    target.style.height = '0px';
                }
                attrs.expanded = !attrs.expanded;
            });
        }
    }
});
