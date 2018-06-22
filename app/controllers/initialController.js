panelProductos.controller( 'productoController', ['$scope', '$rootScope', '$http', 'tabsManagment', 'productsFactory', 'pagesFactory', 'pagesProductsFactory',
'$timeout', 'wordpressPagesManager', function($scope, $rootScope, $http, tabsManagment, productsFactory, pagesFactory, pagesProductsFactory, $timeout,
wordpressPagesManager){
    $scope.controllerName = "paginationController";
    $scope.pagesFactory = pagesFactory;
    $scope.productsFactory = productsFactory;
    $scope.pagesProductsFactory = pagesProductsFactory;
    $scope.basePage = $scope.pagesFactory.basePage;
    $scope.productsTrunk = $scope.productsFactory.products;

    $scope.wordpressPages = wordpressData.pages;
    $scope.wordpressPagesManager = wordpressPagesManager;

    $scope.basePageSelection = {
        selectedPage: {},
    };

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
                $scope.changeToPage(pageID, false);
        },
    }
    //console.log($scope.productsTrunk);
    //$scope.pagesTree = $scope.pagesFactory.pagesTree();

    tabsManagment.activateTab( $rootScope, 'paginationController');
    // =============================================================================
    // DATA BASE
    // =============================================================================

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
                        $scope.updateButtonWordpressPage(button).then(function(result){
                            savingData.saving = false;
                        });
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

    $scope.goBack = function(){
        $scope.changeToPage( $scope.currentPage.parentPageObject.ID );
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

    // =============================================================================
    // BEGGINING SECTION
    // =============================================================================
    $scope.selectBasePageModalOpen = false;

    $scope.openSelectBasePageModal = function(){
        $scope.selectBasePageModalOpen = true;
    };

    $scope.closeSelectBasePageModal = function(){
        $scope.selectBasePageModalOpen = false;
    };

    $scope.selectBasePageModalConfirmed = function(){
        $scope.closeSelectBasePageModal();
        var basePage = Object.assign({}, $scope.pagesFactory.basePage);
        basePage.wp_page_ID = $scope.basePageSelection.selectedPage.ID;
        $scope.pagesFactory.editPage(basePage);
        console.log(basePage);
    };

    $scope.createBasePageModalOpen = false;

    $scope.openCreateBasePageModal = function(){
        $scope.createBasePageModalOpen = true;
    };

    $scope.closeCreateBasePageModal = function(){
        $scope.createBasePageModalOpen = false;
    };

    $scope.createBasePageModalConfirmed = function(){
        $scope.closeSelectBasePageModal();
    };

    // =========================================================================
    // LOST PAGES
    // =========================================================================
    $scope.lostPages = {
        filtered: [],
        filteredPages: function(){
            return $scope.pagesFactory.pagesNotRelatedWithWpPages.map(function(page){
                console.log(page);
                return !$scope.pagesFactory.isNotRelatedChild(page);
            });
        },
    };

    $scope.generatePageFor = function(page, checkChilds){
        console.log(page.parentPageObject.wpPage);
        var pageData = {
            title:  page.name,
            excerpt: page.description,
            parent: page.parentPageObject.wpPage.id,
            status: 'publish',
            meta: {
                gg_page_ID: page.ID,
            },
        };
        console.log(pageData);
        var creationPromise = $scope.wordpressPagesManager.createPage(pageData);
        creationPromise.then(function(result){//termina de crearse la pagina
            $scope.pagesFactory.removePageFromLosts(page);
            console.log(result.data);
            if(result.data){
                page.wp_page_ID = result.data.id;//Le asignamos la nueva id de la WP_Page a la pagina
                page.wpPage = result.data;
                $scope.pagesFactory.editPage(page).then(function(result){
                    console.log(result.data);
                }).catch(function(e){
                    console.log(e);
                });//update
                if(checkChilds && page.childPagesObj){//Si tiene hijos
                    page.childPagesObj.forEach(function(child){
                        if(child.wpPage){//Si el hijo esta relacionado a una WP_Page
                            var pageData = {
                                id: child.wpPage.id,
                                parent: page.wpPage.id,//le asigno el nuevo padre
                            }
                            $scope.wordpressPagesManager.editPage(pageData);//actualizo
                        }
                    });
                }
            }
        });
        return creationPromise;
    };

    $scope.generatePagesRecursively = function(parentPage){
        console.log("-----Comienza la generacion para " + parentPage.name + "-----");
        if(!parentPage.wpPage){//Si no esta relacionada con una WP_Page
            console.log("No esta relacionada con un WP_Page", "Se procede a crear la pagina");
            var creationPromise = $scope.generatePageFor(parentPage, true);//Crea la pagina
            creationPromise.then(function(result){//Al finalizar creacion...
                console.log("Termino la creacion");
                if(parentPage.childPagesObj){//Si tiene hijos
                    parentPage.childPagesObj.forEach(function(page){
                        if($scope.pagesFactory.isNotRelated(page))//Si el hijo es una pagina perdida
                            $scope.generatePagesRecursively(page);//Se repite el proceso con el hijo
                    })
                }
            }).catch(function(e){console.log(e)});
        }
    };

    $scope.generateAllLostPages = function(){
        $scope.lostPages.filteredPages().forEach(function(page){
            $scope.generatePagesRecursively(page);
        });
    };

    $scope.updateButtonWordpressPage = function(button){
        button.wpPage.title = button.name;
        if(button.visibility == true)
            button.wpPage.status = "publish";
        else
            button.wpPage.status = "draft";

        return $scope.wordpressPagesManager.editPage(button.wpPage);
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

    $scope.changeToPage = function( buttonID, searchOnCurrentButtons ){
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

            $scope.onPageLoad();
        }
    }

    $scope.loadingInterval = setInterval(function(){
        if ( !$scope.pagesFactory.loading ){
            $scope.currentPage = $scope.pagesFactory.getBasePage();
            if($scope.currentPage){
                console.log($scope.currentPage);
                $scope.updateCurrentButtons();
                $scope.onPageLoad();
            }
            clearInterval($scope.loadingInterval);
            $scope.$apply();
            console.log($scope);
        }
    }, 100);

}]);
