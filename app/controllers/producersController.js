panelProductos.controller( 'producersController', ['$scope', '$rootScope', '$http', 'tabsManagment', 'producersManager',
'$timeout', function($scope, $rootScope, $http, tabsManagment, producersManager, $timeout){
    tabsManagment.activateTab( $rootScope, 'producersController');
    console.log($scope);
    $scope.producersManager = producersManager;

    $scope.producersFilters = {
        filteredProducts: [],
        name: '',
        orderBy: 'name',
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
            return Math.ceil($scope.producersFilters.filteredProducers.length / this.amountPerPage);
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
    //The PRODUCER that is currently being edited or about to be removed.
    //If some other customization option comes up, the PRODUCER should be
    //saved here, and if concluded, cleared.
    $scope.producerBeingManaged = {};
    //Copy of the PRODUCER to edit, that will have the edited data of the PRODUCER,
    //to be saved in the databased if desired
    $scope.producerToEditNewData = {};
    //Modals triggers, set to true to open the respective modals.
    $scope.editProducerModalOpen = false;
    $scope.removeProducerModalOpen = false;
    $scope.addNewProducerModalOpen = false;


    // =====================================================================
    // PRODUCER BEING MANAGED FUNCTIONS
    // =====================================================================
    $scope.clearProducerBeingManaged = function(){
        $scope.ProducerBeingManaged = {};
    }

    // =====================================================================
    // EDIT PRODUCT FUNCTIONS
    // =====================================================================
    $scope.exitEditProducerModal = function(){
        $scope.closeEditProducerModal();
    }

    $scope.closeEditProducerModal = function(){
        $scope.editProducerModalOpen = false;
        $scope.ProducerToEditNewData = {};
        $scope.clearProducerBeingManaged();
    }

    $scope.openEditProducerModal = function(producer){
        $scope.editProducerModalOpen = true;
        $scope.producerBeingManaged = producer;
        $scope.producerToEditNewData = Object.assign({}, producer);
    }

    $scope.saveProducerNewData = function(){
        producersManager.editProducer($scope.producerToEditNewData);
        $scope.closeEditProducerModal();
    }

    // =====================================================================
    // REMOVE PRODUCT FUNCTIONS
    // =====================================================================
    $scope.exitRemoveProducerModal = function(){
        $scope.closeRemoveProducerModal();
    }

    $scope.closeRemoveProducerModal = function(){
        $scope.removeProducerModalOpen = false;
        $scope.clearProducerBeingManaged();
    }

    $scope.openRemoveProducerModal = function(producer){
        $scope.removeProducerModalOpen = true;
        $scope.producerBeingManaged = producer;
    }

    $scope.modalRemoveProducerConfirmed = function(){
        producersManager.removeProducer($scope.producerBeingManaged.ID);
        $scope.closeRemoveProducerModal();
    }

    // =====================================================================
    // ADD NEW PRODUCER FUNCTIONS
    // =====================================================================
    $scope.producerIdExists = false;

    $scope.checkIfProducerIdExists = function( producerID ){
        if ( producersManager.getProducerByID(producerID) )
            $scope.producerIdExists = true;
        else
            $scope.producerIdExists = false;
        return $scope.producerIdExists;
    }

    $scope.exitAddNewProductModal = function(){
        $scope.closeAddNewProducerModal();
    }

    $scope.closeAddNewProducerModal = function(){
        $scope.addNewProducerModalOpen = false;
        $scope.producerIdExists = false;
        $scope.clearProducerBeingManaged();
    }

    $scope.openAddNewProducerModal = function(){
        $scope.addNewProducerModalOpen = true;
        $scope.producerBeingManaged = {
            ID: '',
            name: "",
            logo: "",
            site: "",
            information: "",
        }
    }

    $scope.modalAddNewProducerConfirmed = function(){
        producersManager.addProducer($scope.producerBeingManaged);
        $scope.closeAddNewProducerModal();
    }
}]);
