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
