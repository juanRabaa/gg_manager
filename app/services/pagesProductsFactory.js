panelProductos.factory('pagesProductsFactory', ['$http', 'errorsManager', 'productsFactory', function($http, errorsManager, productsFactory) {
    var pagesProductsFactory = {
        products: [],
        error: false,
        loading: true,
        sanitazeProduct: function( prod ){
            prod.product_object = productsFactory.getProductByID(prod.prodID);
            prod.use_prod_name = parseInt(prod.use_prod_name) == true;
            prod.use_prod_image = parseInt(prod.use_prod_image) == true;
            prod.use_prod_description = parseInt(prod.use_prod_description) == true;
            return prod;
        },
        updateProducts: function(){
            this.loading = true;
            var _this = this;
            $http.get(templateUrl + '/wp-json/gg/v1/fpages/get/all').then(function(result){
                if(result.data){
                    console.log(result.data);
                    result.data.forEach(function( productPageRelation ){
                        var pageID = productPageRelation.pageID;
                        _this.sanitazeProduct(productPageRelation);
                        console.log(productPageRelation);
                        if( !_this.products[pageID] )
                            _this.products[pageID] = [productPageRelation];
                        else
                            _this.products[pageID].push(productPageRelation);
                    });
                }
                _this.loading = false;
            }).catch(function(e){
                var error = e;
                if ( typeof(e) == "object" && e.data )
                    error = e.data.message;
                errorsManager.errorOcurred = {
                    description: "No se pudieron cargar los productos de las paginas",
                    reason: "Mensaje: " + error,
                };
                _this.error = e;
                //_this.loading = false;
            });
        },
        findProductFrom: function(prodID, pageID){
            var result = {};
            if ( !this.products[pageID] )
                result = this.products[pageID].find(product => product.prodID == prodID);
            return result;
        },
        getProductsFrom: function(pageID){
            if ( !this.products[pageID] )
                this.products[pageID] = [];
            return this.products[pageID];
        },
        addPageProduct: function( pageProd, callback){
            console.log("To add: ", pageProd);
            var pagesProductsFactory = this;
            var url = templateUrl + '/wp-json/gg/v1/fpages/add';
            var config = {
                method: 'POST',
                url: url,
                data: pageProd,
                savingNiceInfo: "Agregando: " + pageProd.prodID,
            };
            $http(config).then(function(result){
                console.log(result);
                var error = result.data.last_error;
                if ( error == "" ){
                    pagesProductsFactory.products[pageProd.pageID].push( pageProd );
                    Materialize.toast(pageProd.prodID + " agregado!", 5000);
                }
                else
                    Materialize.toast("Error al agregar el producto: " + result.data.last_error, 10000);
                callback(result);
            });
        },
        editPageProd: function( pageProd, callback){
            console.log("To edit: ", pageProd);
            var pagesProductsFactory = this;
            var url = templateUrl + '/wp-json/gg/v1/fpages/edit';
            var config = {
                method: 'POST',
                url: url,
                data: pageProd,
                savingNiceInfo: "Editando: " + pageProd.prodID,
            };
            $http(config).then(function(result){
                console.log(result);
                var error = result.data.last_error;
                if ( error == "" ){
                    var product = pagesProductsFactory.findProductFrom(pageProd.prodID, pageProd.pageID);
                    product = pageProd;
                    Materialize.toast(pageProd.prodID + " editado!", 5000);
                }
                else
                    Materialize.toast("Error al editar el producto: " + result.data.last_error, 10000);
                if(callback)
                    callback(result);
            });
        },
        removePageProd: function( pageProd, callback){
            console.log("To remove: ", pageProd);
            var pagesProductsFactory = this;
            var url = templateUrl + '/wp-json/gg/v1/fpages/delete';
            var config = {
                method: 'POST',
                url: url,
                data: pageProd,
                savingNiceInfo: "Removing: " + pageProd.prodID,
            };
            $http(config).then(function(result){
                console.log(result);
                var error = result.data.last_error;
                if ( error == "" ){
                    var result = pagesProductsFactory.products[pageProd.pageID].findAndRemove( pp => pp.prodID == pageProd.prodID );
                    console.log(result);
                    if(result)
                        Materialize.toast(pageProd.pageID + " eliminado!", 5000);
                }
                else
                    Materialize.toast("Error al eliminar el producto: " + result.data.last_error, 10000);
                callback(result);
            });
        },
    };

    pagesProductsFactory.updateProducts();
    return pagesProductsFactory;
}]);
