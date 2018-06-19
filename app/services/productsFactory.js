panelProductos.factory('productsFactory', ['errorsManager', '$http', function(errorsManager, $http) {
    var productsFactory = {
        products: [],
        error: false,
        loading: true,
        //Gets the products from the DB and store them in the products var
        updateProducts: function () {
            this.loading = true;
            var _this = this;
            $http.get(templateUrl + '/wp-json/gg/v1/products/get/all').then(function(result){
                _this.products = result.data;
                _this.loading = false;
                console.log(_this);
            }).catch(function(e){
                var errorMessage = e;
                if ( typeof(e) == "object" && e.data )
                    errorMessage = e.data.message;
                console.log(e);
                errorsManager.errorOcurred = {
                    description: "No se pudieron cargar los productos",
                    reason: "Mensaje: " + errorMessage,
                };;
                _this.error = e;
            });;
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
            $http.post(templateUrl + '/wp-json/gg/v1/products/edit', newProductData).then(function(result){
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
}]);
