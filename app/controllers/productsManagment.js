panelProductos.controller( 'productsManagmentController', ['$scope', '$rootScope', '$http', 'tabsManagment', 'productsFactory',
function($scope, $rootScope, $http, tabsManagment, productsFactory){
        $scope.controllerName = "productsManagmentController";
        console.log($rootScope);
        tabsManagment.activateTab( $rootScope, 'productsManagmentController');

        $scope.productsFactory = productsFactory;

        $scope.productsFilters = {
            filteredProducts: [],
            name: '',
            orderBy: 'name',
            toShow: 'all',
            orderOption: [{
                niceName: 'Nombre',
                value: 'name',
            }, {
                niceName: 'Precio',
                value: '-price',
            }, {
                niceName: 'ID',
                value: 'ID',
            }],
            showOption: [{
                niceName: 'Todos',
                value: 'all',
            }, {
                niceName: 'Habilitados',
                value: 'enabled',
            }, {
                niceName: 'Deshabilitados',
                value: 'disabled',
            }],
            showOptionFilter: function(product, index, array){
                switch( $scope.productsFilters.toShow ){
                    case "all":
                        return true;
                        break;
                    case "enabled":
                        if ( product.enabled )
                            return true;
                        break;
                    case "disabled":
                        if ( !product.enabled )
                            return true;
                        break;
                    default:
                        return true;
                        break;
                }
            }
        };

        $scope.pagination = {
            amountPerPage: 10,
            page: 1,
            from: function(){
                return this.amountPerPage * (this.page - 1);
            },
            next: function(){
                if( this.page < this.lastPage() )
                    this.page++;
            },
            previous: function(){
                if( this.page > 1 )
                    this.page--;
            },
            jumpTo: function(page){
                this.page = page;
            },
            lastPage: function(){
                //console.log($scope.productsFilters.filteredProducts);
                return Math.ceil($scope.productsFilters.filteredProducts.length / this.amountPerPage);
            },
            isLastPage: function(){
                return this.page == this.lastPage();
            },
            isFirstPage: function(){
                return this.page == 1;
            },
        }

        // =====================================================================
        // VARS
        // =====================================================================
        $scope.productsTrunk = productsFactory.products;
        //The product that is currently being edited or about to be removed.
        //If some other customization option comes up, the product should be
        //saved here, and if concluded, cleared.
        $scope.productBeingManaged = {};
        //Copy of the product to edit, that will have the edited data of the product,
        //to be saved in the databased if desired
        $scope.productToEditNewData = {};
        //Modals triggers, set to true to open the respective modals.
        $scope.editProductModalOpen = false;
        $scope.removeProductModalOpen = false;
        $scope.addNewProductModalOpen = false;

        // =====================================================================
        // PRODUCT BEING MANAGED FUNCTIONS
        // =====================================================================
        $scope.clearProductBeingManaged = function(){
            $scope.productBeingManaged = {};
        }

        // =====================================================================
        // EDIT PRODUCT FUNCTIONS
        // =====================================================================
        $scope.exitEditProductModal = function(){
            $scope.closeEditProductModal();
        }

        $scope.closeEditProductModal = function(){
            $scope.editProductModalOpen = false;
            $scope.productToEditNewData = {};
            $scope.clearProductBeingManaged();
        }

        $scope.openEditProductModal = function(product){
            $scope.editProductModalOpen = true;
            $scope.productBeingManaged = product;
            $scope.productToEditNewData = Object.assign({}, product);
        }

        $scope.saveProductNewData = function(){
            productsFactory.editProduct($scope.productToEditNewData);
            $scope.closeEditProductModal();
        }

        // =====================================================================
        // REMOVE PRODUCT FUNCTIONS
        // =====================================================================
        $scope.exitRemoveProductModal = function(){
            $scope.closeRemoveProductModal();
        }

        $scope.closeRemoveProductModal = function(){
            $scope.removeProductModalOpen = false;
            $scope.clearProductBeingManaged();
        }

        $scope.openRemoveProductModal = function(product){
            $scope.removeProductModalOpen = true;
            $scope.productBeingManaged = product;
        }

        $scope.modalRemoveProductConfirmed = function(){
            productsFactory.removeProduct($scope.productBeingManaged.ID);
            $scope.closeRemoveProductModal();
        }

        // =====================================================================
        // ADD NEW PRODUCT FUNCTIONS
        // =====================================================================
        $scope.productIdExists = false;
        $scope.parentSearch = {
            query: "",
        };

        $scope.toggleParentProduct = function( prodID ){
            if ( $scope.productBeingManaged.parent_product_ID == prodID )
                $scope.productBeingManaged.parent_product_ID = "";
            else
                $scope.productBeingManaged.parent_product_ID = prodID;
        }

        $scope.checkIfProductIdExists = function( prodID ){
            if ( productsFactory.getProductByID(prodID) )
                $scope.productIdExists = true;
            else
                $scope.productIdExists = false;
            return $scope.productIdExists;
        }

        $scope.exitAddNewProductModal = function(){
            $scope.closeAddNewProductModal();
        }

        $scope.closeAddNewProductModal = function(){
            $scope.addNewProductModalOpen = false;
            $scope.productIdExists = false;
            $scope.clearProductBeingManaged();
        }

        $scope.openAddNewProductModal = function(){
            $scope.addNewProductModalOpen = true;
            $scope.productBeingManaged = {
                ID: '',
                name: "",
                image: "",
                price_pesos: null,
                description: "",
                enabled: true,
                parent_product_ID: '',
                webVisibility: true,
            }
        }

        $scope.modalAddNewProductConfirmed = function(){
            productsFactory.addProduct($scope.productBeingManaged);
            $scope.closeAddNewProductModal();
        }

}]);
