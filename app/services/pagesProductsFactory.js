panelProductos.factory('pagesProductsFactory', ['$http', 'errorsManager', function($http, errorsManager) {
    var pagesProductsFactory = {
        products: [],
        error: false,
        loading: true,
        updateProducts: function(){
            this.loading = true;
            var _this = this;
            $http.get(templateUrl + '/wp-json/gg/v1/fpages/get/all').then(function(result){
                if(result.data){
                    console.log(result.data);
                    result.data.forEach(function( productPageRelation ){
                        var pageID = productPageRelation.pageID;
                        var prodID = productPageRelation.prodID;
                        if( !_this.products[pageID] )
                            _this.products[pageID] = [productPageRelation];
                        else
                            _this.products[pageID].push(productPageRelation);
                    });
                }
                _this.loading = false;
            }).catch(function(e){
                errorsManager.errorOcurred = {
                    description: "No se pudieron cargar los productos de las paginas",
                    reason: "Mensaje: " + e.data.message,
                };
                _this.error = e;
                _this.loading = false;
            });
        },
        getProductsFrom: function(pageID){
            return this.products[pageID];
        },
    };

    pagesProductsFactory.updateProducts();
    return pagesProductsFactory;
}]);
