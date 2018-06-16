panelProductos.controller( 'productoController', ['$scope', '$rootScope', '$http', 'tabsManagment', 'productsFactory', 'pagesFactory', 'pagesProductsFactory',
'$timeout', function($scope, $rootScope, $http, tabsManagment, productsFactory, pagesFactory, pagesProductsFactory, $timeout){
    $scope.controllerName = "paginationController";
    $scope.pagesFactory = pagesFactory;
    $scope.productsFactory = productsFactory;
    $scope.pagesProductsFactory = pagesProductsFactory;
    $scope.basePage = $scope.pagesFactory.basePage;
    $scope.productsTrunk = $scope.productsFactory.products;
    $scope.pagesTree = {
        activated: false,
        filters: {
            name: "",
            recursiveNameFilter: function(page, index, array){
                var nameQuery = $scope.pagesTree.filters.name;
                if( page.name.toLowerCase().includes(nameQuery.toLowerCase()) ){
                    //console.log("Esta pagina contiene el string buscado", page.name);
                    return true;
                }
                else if(page.childPagesObj){
                    var recRes = page.childPagesObj.some(function(page){
                        return $scope.pagesTree.filters.recursiveNameFilter(page);
                    });
                    if (recRes)
                        console.log("Esta pagina tiene un hijo con el string buscado", page.name);
                    return recRes;
                }
                return false;
            }
        },
        changeToPage: function(pageID, $event){
            $event.stopPropagation();
            if ( $scope.currentPage.ID != pageID )
                $scope.changeToPage(pageID, false, true);
        },
    }
    console.log($scope.productsTrunk);
    console.log($scope.basePage.childPagesObj);
    //$scope.pagesTree = $scope.pagesFactory.pagesTree();

    tabsManagment.activateTab( $rootScope, 'paginationController');
    // =============================================================================
    // DATA BASE
    // =============================================================================
    //Test,should be DB
    $scope.buttonsInventory = [
        {
            ID: 'A0',
            name: "Productos",
            pageType: "category_page",
            buttonsType: "no_image",
            position: 1,
        },
        {
            ID: 'C1',
            name: "Turroneria",
            buttonsType: "side_image",
            description: "Turrones y demas cosas",
            pageType: "category_page",
            visibility: true,
            parentCategoryID: 'A0',
            position: 2,
        },
        {
            ID: 'C2',
            name: "Chocolates & delicatessen",
            buttonsType: "side_image",
            description: "La mostarda es una conserva típica italiana, un chutney, hecho con frutas enteras, azúcar, y esencia de mostaza. Son recetas con sabor muy intenso, que combina perfectamente con platos salados: carnes rojas y blancas, etc. También, se utiliza como ingrediente en algunas preparaciones como, por ejemplo, los tortelli di zucca (‘raviolis de calabaza’).",
            pageType: "category_page",
            visibility: false,
            parentCategoryID: 'A0',
            position: 1,
        },
        {
            ID: 'C3',
            name: "Espumantes",
            buttonsType: "huge_image",
            pageType: "category_page",
            description: "Buseca y vino tintoooo",
            visibility: true,
            parentCategoryID: 'A0',
            position: 3,
        },
        {
            ID: 'C4',
            name: "Vinos especiales",
            buttonsType: "no_image",
            pageType: "category_page",
            description: "Testeando la descripcion",
            visibility: true,
            parentCategoryID: 'A0',
            position: 4,
        },
        {
            ID: 'C6',
            name: "Vinos",
            buttonsType: "no_image",
            pageType: "category_page",
            description: "Testeando la descripcion",
            visibility: false,
            position: 5,
        },
        {
            ID: 'C7',
            name: "Regaleria",
            buttonsType: "no_image",
            pageType: "category_page",
            description: "Testeando la descripcion",
            visibility: true,
            vposition: 6,
        },
        {
            ID: 'C8',
            name: "Miniaturas",
            buttonsType: "no_image",
            pageType: "category_page",
            description: "Testeando la descripcion",
            visibility: true,
            position: 7,
        },
        {
            ID: 'C9',
            name: "Vinos",
            buttonsType: "no_image",
            pageType: "category_page",
            description: "Testeando la descripcion",
            visibility: true,
            position: 8,
        },
        {
            ID: 'C10',
            name: "Licores internacionales",
            buttonsType: "no_image",
            pageType: "category_page",
            description: "Testeando la descripcion",
            visibility: true,
            position: 9,
        },
        {
            ID: 'C12',
            name: "Espirituosas",
            buttonsType: "no_image",
            pageType: "category_page",
            description: "Testeando la descripcion",
            visibility: true,
            position: 10,
        },
        {
            ID: 'C13',
            name: "Aperitivos",
            buttonsType: "no_image",
            pageType: "category_page",
            description: "Testeando la descripcion",
            visibility: true,
            position: 11,
        },
        {
            ID: 'C14',
            name: "Turroncitos",
            buttonsType: "no_image",
            pageType: "category_page",
            description: "Testeando la descripcion",
            visibility: true,
            parentCategoryID: 'C1'
        },
        {
            ID: 'C15',
            name: "Barras",
            buttonsType: "no_image",
            pageType: "category_page",
            description: "Testeando la descripcion",
            visibility: true,
            parentCategoryID: 'C1'
        },
        {
            ID: 'C16',
            name: "Regaleria",
            buttonsType: "no_image",
            pageType: "category_page",
            description: "Testeando la descripcion",
            visibility: true,
            parentCategoryID: 'C1'
        },
        {
            ID: 'C17',
            name: "Chutney",
            buttonsType: "no_image",
            image: "http://localhost/wordpress2/htdocs/wp-content/uploads/2018/05/Chutney.png",
            description: "Testeando la descripcion",
            pageType: "category_page",
            visibility: true,
            parentCategoryID: 'C2'
        },
        {
            ID: 'C18',
            name: "Chocolates y bombones",
            buttonsType: "huge_image",
            pageType: "category_page",
            image: "http://localhost/wordpress2/htdocs/wp-content/uploads/2018/05/chocolate-y-bombones.png",
            description: "Testeando la descripcion",
            visibility: true,
            parentCategoryID: 'C2'
        },
        {
            ID: 'C19',
            name: "Amaretti Lazaronni",
            buttonsType: "no_image",
            pageType: "category_page",
            image: "http://localhost/wordpress2/htdocs/wp-content/uploads/2018/05/Amaretti.png",
            description: "Testeando la descripcion",
            visibility: true,
            parentCategoryID: 'C2'
        },
        {
            ID: 'C20',
            name: "Acetos y cremas balsamicas",
            buttonsType: "no_image",
            pageType: "category_page",
            image: "http://localhost/wordpress2/htdocs/wp-content/uploads/2018/05/Acetos.png",
            description: "Testeando la descripcion",
            visibility: true,
            parentCategoryID: 'C2'
        },
        {
            ID: 'P1',
            name: "Bombones vergani",
            buttonsType: "no_image",
            pageType: "final_page",
            image: "http://localhost/wordpress2/htdocs/wp-content/uploads/2018/05/Bombones-vergani.png",
            description: "Testeando la descripcion",
            visibility: true,
            parentCategoryID: 'C18'
        },
        {
            ID: 'P2',
            name: "Aero",
            buttonsType: "no_image",
            image: "http://localhost/wordpress2/htdocs/wp-content/uploads/2018/03/Aero.png",
            pageType: "final_page",
            description: "Testeando la descripcion",
            visibility: true,
            parentCategoryID: 'C18'
        },
        {
            ID: 'P3',
            name: "After Eight",
            buttonsType: "no_image",
            pageType: "final_page",
            image: "http://localhost/wordpress2/htdocs/wp-content/uploads/2018/03/After-Eight-1.png",
            description: "Testeando la descripcion",
            visibility: true,
            parentCategoryID: 'C18'
        },
    ];

    $scope.productsFinalPage = [
        {
            prodID: 'AFTEIG200',
            pageID: 'P3',
            name: '',
            decription: '',
            image: '',
            use_prod_name: true,
            use_prod_description: true,
            use_prod_image: true,
            position: 1,
        },
        {
            prodID: 'AFTEIG300',
            pageID: 'P3',
            name: '',
            decription: '',
            image: '',
            use_prod_name: true,
            use_prod_description: true,
            use_prod_image: true,
            position: 2,
        },
        {
            prodID: 'AFTEIG400',
            pageID: 'P3',
            name: '',
            decription: '',
            image: '',
            use_prod_name: true,
            use_prod_description: true,
            use_prod_image: true,
            position: 3,
        },
    ]

    /*$scope.productsTrunk = [
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

    $scope.buttonsTypes = [
        {
            name: "Sin imagen",
            value: "no_image",
        },
        {
            name: "Con imagen al costado",
            value: "side_image",
        },
        {
            name: "Con imagen centrada",
            value: "huge_image",
        },
    ];

    $scope.pageTypes = [
        {
            name: "Categoria",
            value: "category_page",
        },
        {
            name: "Pagina final",
            value: "final_page",
        },
    ];

    $scope.isTrue = function(value){
        return value == true;
    };
    $scope.teste = function(asd){
            console.log(asd);
    };
    // =====================================================================
    // SAVING INFORMATION
    // =====================================================================
    $scope.savingQueue = {};

    $scope.manageSavingQueue = function(button){
        var oldTimeout = $scope.savingQueue[button.ID] ? $scope.savingQueue[button.ID].timeOut : null;
        var oldSaving = $scope.savingQueue[button.ID] ? $scope.savingQueue[button.ID].saving : false;
        if ( oldTimeout )
            $timeout.cancel(oldTimeout);

        var savingData;
        if( $scope.savingQueue[button.ID] ){
            if ( !button.hasOwnProperty("prodID") )
                savingData = $scope.savingQueue[button.ID];
            else
                savingData = $scope.savingQueue[button.prodID];
        }
        else{
            if ( !button.hasOwnProperty("prodID") )
                savingData = $scope.savingQueue[button.ID] = {};
            else
                savingData = $scope.savingQueue[button.prodID] = {};
        }

        savingData.newData = button;
        savingData.timeOut = $timeout(function(){
            console.log(savingData);
            if( !savingData.saving ){
                savingData.saving = true;
                if ( !button.hasOwnProperty("prodID") ){
                    $scope.pagesFactory.editPage(button, function(result){
                        var error = result.data.last_error;
                        if ( error )
                            console.log("ERROR SAVING DATA", error);
                        savingData.saving = false;
                    });
                }
                else {
                    $scope.pagesProductsFactory.editPageProd(button, function(result){
                        var error = result.data.last_error;
                        if ( error )
                            console.log("ERROR SAVING DATA", error);
                        savingData.saving = false;
                    });
                }
            }
        }, 1200);

        console.log(savingData);
        console.log($scope.savingQueue);
    }

    $scope.buttonsOldData = [];

    // =============================================================================
    // OBJECTS
    // =============================================================================

    $scope.currentPage = {};

    $scope.newButton = {}

    $scope.pagesHistory = {
        history: [],
        length: function(){
            return this.history.length;
        },
        goBack: function(){
            var buttonID = this.history[ this.history.length - 2 ].ID;
            if ( buttonID ){
                $scope.changeToPage( buttonID );
                this.history.pop();
            }
        },
        addPage: function( page ){
            this.history.push({
                ID: page.ID,
                name: page.name,
                description: page.description,
            });
        }
    };

    $scope.changePageEnabled = true;

    //Pages
    $scope.currentButtons = [];
    $scope.buttonToDelete = {};
    $scope.newButtonModalOpen = false;
    $scope.removeButtonOpen = false;

    //Products
    $scope.currentProducts = [];
    $scope.currentProdPageRelations = [];
    $scope.addProductModalOpen = false;
    $scope.productsToAdd = [];
    $scope.removeProductOpen = false;
    $scope.toRemoveProduct = {};
    $scope.productSearchForm = {
        query: "",
    };
    // =========================================================================
    // METHODS
    // =========================================================================

    $scope.onPageLoad = function(){
        $scope.sortButtons();
    }

    // =========================================================================
    // SORTING METHODS
    // =========================================================================
    $scope.sortableOptions = {
        disabled: true,
        oldSorting: [],
        update: function(e, ui) {},
        stop: function(e, ui) {
            for (var index in $scope.currentButtons) {
                $scope.currentButtons[index].position = index;
            }
            console.log("STOP");
        },
        axis: 'y',
    };

    $scope.storeCurrentButtonsOrder = function(){
        //For final pages (products)
        if( $scope.currentPage.page_type == "final_page" )
            $scope.sortableOptions.oldSorting = $scope.currentProducts.map(prod => prod.prodID);
        else//For categories
            $scope.sortableOptions.oldSorting = $scope.currentButtons.map(button => button.ID);
        console.log($scope.sortableOptions.oldSorting);
    }

    $scope.orderChanged = function(){
        //For final pages (products)
        if( $scope.currentPage.page_type == "final_page" ){
            return $scope.currentProducts.some(function( prod, index ){
                return prod.prodID != $scope.sortableOptions.oldSorting[index];
            });
        }
        else{//For categories
            return $scope.currentButtons.some(function( button, index ){
                return button.ID != $scope.sortableOptions.oldSorting[index];
            });
        }
    }

    $scope.sortButtons = function(){
        //For categories
        if ( $scope.currentPage.page_type != "final_page" ){
            $scope.currentButtons.sort(function (a, b) {
                return a.position > b.position;
            });
        }
        else{//For final pages (products)
            $scope.currentProducts.sort(function (a, b) {
                return a.position > b.position;
            });
        }
    }

    $scope.enableSorting = function(){
        $scope.storeCurrentButtonsOrder();
        $scope.changePageEnabled = false;
        $scope.sortableOptions.disabled = false;
    };

    $scope.endSorting = function(){
        $scope.changePageEnabled = true;
        $scope.sortableOptions.disabled = true;
        $scope.updateElementsOrder();
        if($scope.orderChanged()){
            if ( $scope.currentPage.page_type == "final_page" )
                $scope.saveCurrentProductsOnDB();
            else
                $scope.saveCurrentButtonsOnDB();
        }
    }

    $scope.updateElementsOrder = function(){
        console.log("updating positions of...");
        if ( $scope.currentPage.page_type == "category_page" ){
            console.log("categorie buttons");
            for (var index in $scope.currentButtons) {
                $scope.currentButtons[index].position = index;
            }
        }
        else if ( $scope.currentPage.page_type == "final_page" ){
            console.log("products");
            $scope.currentProducts.forEach(function(prod, index){
                console.log(prod.prodID, index)
                prod.position = index;
            });
        }
    }

    $scope.updateFinalPageProductsOrder = function(){
        $scope.currentProducts.forEach(function( prod ){
            $scope.updateProdPageRelation( prod, $scope.currentPage.ID );
        });
    }

    // =========================================================================
    //
    // =========================================================================

    $scope.prodPageRelationName = function( prodRelation ){
        //console.log(prodRelation);
        if ( prodRelation.use_prod_name ){
            //console.log(prodRelation.use_prod_name);
            return prodRelation.product_object.name;
        }
        return prodRelation.name;
    }

    $scope.prodPageRelationDescription = function( prodRelation ){
        if ( prodRelation.use_prod_description )
            return prodRelation.product_object.description;
        return prodRelation.description;
    }
    $scope.prodPageRelationImage = function( prodRelation ){
        if ( prodRelation.use_prod_image )
            return prodRelation.product_object.image;
        return prodRelation.image;
    }

    $scope.productsToAddFilter = function(product, index, array){
        return !$scope.isInCurrentProducts(product.ID);
    }

    $scope.isInCurrentProducts = function( productID ){
        var result = false;
        $scope.currentProducts.find( function( product ){
            if ( product.product_object.ID == productID )
                result = true;
        });
        //console.log(productID, result);
        return result;
    }

    /*$scope.removeProductsToAdd = function( productID ){
        $scope.productsToAdd.find( function( product, index ){
            if ( product.ID == productID ){
                $scope.productsToAdd.splice(index, 1);
                return true;
            }
            return false;
        });
    }

    $scope.updateToAddProducts = function( autocompleteData ){
        $scope.selectedProduct = autocompleteData.description;
        $scope.productsToAdd.push( $scope.selectedProduct );
    }*/

    //Adds a product to the current list of products being shown
    $scope.addProductToCurrents = function(  product  ){
        var rel = {
            prodID: product.ID,
            pageID: $scope.currentPage.ID,
            name: product.name,
            decription: '',
            image: '',
            visibility: true,
            use_prod_name: true,
            use_prod_description: true,
            use_prod_image: true,
            product_object: product,
            position: $scope.currentProducts.length,
        };
        $scope.currentProducts.push(rel);
        console.log($scope.currentProducts);
    };

    //Creates the relation between a product and a page
    $scope.addProductToPage = function( product, pageID ){
        var rel = {
            prodID: product.ID,
            pageID: pageID,
            name: product.name,
            decription: '',
            image: '',
            visibility: true,
            use_prod_name: true,
            use_prod_description: true,
            use_prod_image: true,
            product_object: product,
            position: $scope.currentProducts.length,
        };
        $scope.productsFinalPage.push(rel);
        console.log($scope.productsFinalPage);
    };

    $scope.updateProdPageRelation = function( product, pageID ){
        $scope.productsFinalPage.find(function( currentRel, index ){
            if ( currentRel.pageID == pageID && currentRel.prodID == product.prodID ){
                $scope.productsFinalPage[index] = product;
                result = true;
                return true;
            }
            return false;
        });
    }

    $scope.modalRemoveProductConfirmed = function(){
        $scope.pagesProductsFactory.removePageProd($scope.toRemoveProduct);
        $scope.closeRemoveProductModal();
    }

    $scope.closeRemoveProductModal = function(){
        $scope.removeProductOpen = false;
        $scope.toRemoveProduct = {};
    }

    $scope.openRemoveProductModal = function( product ){
        $scope.removeProductOpen = true;
        $scope.toRemoveProduct = product;
        console.log("About to remove: ", product);
    };

    $scope.insertSingleProduct = function( product, $event ){
        if ($event)
            $($event.currentTarget).addClass("disabled");
        var rel = {
            prodID: product.ID,
            pageID: $scope.currentPage.ID,
            name: product.name,
            decription: '',
            image: '',
            visibility: true,
            use_prod_name: true,
            use_prod_description: true,
            use_prod_image: true,
            product_object: product,
            position: $scope.currentProducts.length,
        };
        $scope.pagesProductsFactory.addPageProduct(rel, function(){
            if ($event)
                $($event.currentTarget).removeClass("disabled");
        });
        console.log($scope.currentProducts);
    }

    /*$scope.insertProducts = function(){
        $scope.productsToAdd.forEach(function( product ){
            $scope.insertSingleProduct(product);
        });
        $scope.closeAddProductModal();
    }*/

    $scope.updateCurrentProducts = function(){
        console.log("Searchin products for: ", $scope.currentPage.ID);
        if ( $scope.currentPage.page_type == "final_page" )
            $scope.currentProducts = $scope.pagesProductsFactory.getProductsFrom($scope.currentPage.ID);
        else
            $scope.currentProducts = [];
        console.log($scope.currentProducts);
    };

    $scope.getProductByID = function( productID, onlyCurrents, callback ){
        var wantedProduct = null;
        var index;
        var productsHolder = $scope.productsTrunk;

        if ( onlyCurrents )
            productsHolder = $scope.currentProducts;

        wantedProduct = productsHolder.find(function( product, idx ){
            if ( product.ID == productID ){
                index = idx;
                return true;
            }
            return false;
        });

        if( callback )
            callback( wantedProduct, index, productsHolder );

        return wantedProduct;
    };

    $scope.openAddProductModal = function(){
        //$scope.productsToAdd = [];
        $scope.addProductModalOpen = true;
    }

    $scope.closeAddProductModal = function(){
        $scope.addProductModalOpen = false;
    }

    $scope.closeRemoveButtonModal = function(){
        $scope.removeButtonOpen = false;
    }

    $scope.openRemoveButtonModal = function( button ){
        $scope.buttonToDelete = button;
        $scope.removeButtonOpen = true;
    }

    $scope.deleteButtonConfirmed = function(){
        $scope.deleteButton($scope.buttonToDelete);
        $scope.closeRemoveButtonModal();
    }

    $scope.openNewButtonModal = function(){
        $scope.newButtonModalOpen = true;
    }

    $scope.newPageFormValid = function(){
        var fails = [];
        if ( !$scope.newButton.ID ){
            fails.push('Ingrese una ID');
        }
        if ( !$scope.newButton.name ){
            fails.push('Ingrese un nombre');
        }
        if ( !$scope.newButton.page_type ){
            fails.push('Elija un tipo de pagina');
        }
        if ( $scope.newButton.page_type != "final_page" && !$scope.newButton.buttons_type ){
            fails.push('Elija un diseño de botones');
        }
        if ( $scope.getButton( $scope.newButton.ID ) ){

            fails.push('El ID ' + $scope.newButton.ID + ' ya existe');
        }

        if ( fails.length == 0 )
            return false;

        return fails;
    }

    $scope.insertNewButton = function(){
        var fails = $scope.newPageFormValid();
        if ( fails ){//IF there were any fails
            console.log('Page wasnt created');
            fails.forEach( function( failMessage ){
                Materialize.toast(failMessage, 5000);
            });
            return;
        }

        $scope.newButton.childPagesObj = [];
        $scope.newButton.parent_ID = $scope.currentPage.ID;
        $scope.newButton.position = $scope.currentButtons.length;
        $scope.pagesFactory.addPage($scope.newButton, function(){
            $scope.updateCurrentButtons();
        });
        $scope.newButton = {};
        $scope.newButtonModalOpen = false;
    };

    $scope.addToCurrentButtons = function( pageData ){
        $scope.currentButtons.push(pageData);
        $scope.sortButtons();
    }

    $scope.updateCurrentButtons = function(){
        if ( $scope.currentPage.pageType != "final_page" ){
            $scope.currentButtons = $scope.pagesFactory.getPageChilds($scope.currentPage);
            $scope.sortButtons();
        }
        else
            $scope.currentButtons = [];
    };

    $scope.saveCurrentButtonsOnDB = function(){
        $scope.currentButtons.forEach(function(buttonData){
            $scope.pagesFactory.editPage( buttonData );
        });
    };

    $scope.saveCurrentProductsOnDB = function(){
        $scope.currentProducts.forEach(function(pageProdData){
            $scope.pagesProductsFactory.editPageProd(pageProdData);
        });
    };

    $scope.removeButtonFromCurrents = function( buttonID ){
        var result = false;
        $scope.getButton( buttonID, true, function( button, index, currentButtons ){
            if (index){
                currentButtons.splice(index, 1);
                result = true;
            }
        });
        return result;
    }

    $scope.getButton = function( buttonID, onlyCurrents , callback ){
        var wantedButton = null;
        var index;
        var buttonsHolder = $scope.currentButtons;
        console.log("Searchin for button ID: ", buttonID);
        if ( onlyCurrents ){
            wantedButton = buttonsHolder.find(function( button, idx ){
                if ( button.ID == buttonID ){
                    index = idx;
                    return true;
                }
                return false;
            })
        }
        else{
            wantedButton = $scope.pagesFactory.getPageByID(buttonID,callback);
        }

        if( callback )
            callback( wantedButton, index, buttonsHolder );
        console.log(wantedButton);
        return wantedButton;
    };

    $scope.deleteButton = function( button ){
        $scope.pagesFactory.removePage(button, function(){
            $scope.updateCurrentButtons();
            $scope.$apply();
        });
    };

    $scope.changeToPage = function( buttonID, searchOnCurrentButtons, addToHistory ){
        if ( $scope.changePageEnabled ){
            //$("#buttons-holder").slideUp(1);

            $scope.currentPage = $scope.getButton( buttonID,  searchOnCurrentButtons );
            console.log("Changing to: ", $scope.currentPage.ID);

            if ( $scope.currentPage.page_type == "final_page" ){
                console.log("UPDATE CURRENT PRODUCTS");
                $scope.updateCurrentProducts();
            }
            else
                $scope.updateCurrentButtons();

            //$("#buttons-holder").slideDown();

            if( addToHistory ){
                console.log("Adding " + $scope.currentPage.name + " to history");
                $scope.pagesHistory.addPage($scope.currentPage);
            }
            $scope.onPageLoad();
            console.log($scope.pagesHistory.history);
        }
    }

    $scope.loadingInterval = setInterval(function(){
        if ( !$scope.pagesFactory.loading ){
            $scope.currentPage = $scope.pagesFactory.getBasePage();
            console.log($scope.currentPage);
            $scope.pagesHistory.addPage($scope.currentPage);
            $scope.updateCurrentButtons();
            $scope.onPageLoad();
            clearInterval($scope.loadingInterval);
            $scope.$apply();
            console.log($scope);
        }
    }, 100);

}]);
