<?php
define('WP_USE_THEMES', false);
require('../../../../../wp-load.php');
$page_creator_dir = get_template_directory_uri() . '/page-creator';
$img_dir = $page_creator_dir . "/assets/img";
?>
<div id="gg-product-managment">
    <div class="panel-header">Fabricantes</div>
    <div id="product-list-holder">
        <!-- =============================================================== -->
        <!-- FILTERS -->
        <!-- =============================================================== -->
        <div id="products-list-filters" class="row">
            <div class="row">
                <div class="twelve columns" input-field>
                    <input type="text" ng-model="producersFilters.name">
                    <label ng-class="{active: producersFilters.name}">Nombre</label>
                </div>
            </div>
        </div>
        <!-- =============================================================== -->
        <!-- COLUMNS TITLES -->
        <!-- =============================================================== -->
        <div id="products-list-titles" class="row">
            <div class="two columns">Imagen</div>
            <div class="two columns">ID</div>
            <div class="six columns">Nombre</div>
            <div class="two columns">Controles</div>
        </div>
        <!-- =============================================================== -->
        <!-- PRODUCERS LIST -->
        <!-- =============================================================== -->
        <ul id="products-list">
            <li class="product-item row" ng-repeat="producer in ( producersFilters.filteredProducers = ( producersManager.producers | filter : {name: producersFilters.name} ))">
                <div class="product-item-image two columns">
                    <img class="responsive-img" src="{{producer.logo}}">
                </div>
                <div class="product-item-id two columns">{{producer.ID}}</div>
                <div class="product-item-name six columns">{{producer.name}}</div>
                <div class="product-item-controls two columns">
                    <i tooltipped data-position="top" data-delay="1000" data-tooltip="Editar fabricante"
                    class="fas fa-pencil-alt six columns not-collapse edit-button gg-green-background btn waves-effect waves-light hover-tilt" aria-hidden="true"
                    ng-click="openEditProducerModal(producer)" data-target='editProducerModal' modal open="editProducerModalOpen"></i>
                    <i tooltipped data-position="top" data-delay="1000" data-tooltip="Borrar"
                    class="fas fa-box-open six columns not-collapse delete-button gg-red-background btn waves-effect waves-light hover-tilt" aria-hidden="true"
                    ng-click="openRemoveProducerModal(producer)" data-target='removeProducerModal' modal open="removeProducerModalOpen"></i>
                </div>
            </li>
        </ul>
        <!-- =============================================================== -->
        <!-- NAVIGATION BAR -->
        <!-- =============================================================== -->
        <div id="navigation-bar" >
            <div class="navigation-button-holder three columns">
                <div ng-class="{disabled: pagination.isFirstPage()}" ng-click="pagination.previous()"
            class="btn waves-effect waves-green gg-golden-background">Anterior</div>
            </div>
            <div class="pagination-numbers six columns">
                <span ng-if="pagination.page > 3" class="first-page-numb-holder">
                    <span class="pagination-number" ng-click="pagination.jumpTo(1)">1</span>
                    <span>...</span>
                </span>
                <span ng-if="pagination.page > 1" class="previous-pages-numb-holder">
                    <span class="pagination-number close-page-numb-2" ng-if="pagination.page > 2"
                    ng-click="pagination.jumpTo(pagination.page - 2)">{{pagination.page - 2}}</span>
                    <span class="pagination-number close-page-numb-1"
                    ng-click="pagination.jumpTo(pagination.page - 1)">{{pagination.page - 1}}</span>
                </span>
                <span class="current-page-numb">{{pagination.page}}</span>
                <span ng-if="pagination.page + 1 <= pagination.lastPage()" class="next-pages-numb-holder">
                    <span class="pagination-number close-page-numb-1"
                    ng-click="pagination.jumpTo(pagination.page + 1)">{{pagination.page + 1}}</span>
                    <span class="pagination-number close-page-numb-2" ng-if="pagination.page + 2 <= pagination.lastPage()"
                    ng-click="pagination.jumpTo(pagination.page + 2)">{{pagination.page + 2}}</span>
                </span>
                <span ng-if="pagination.page + 3 <= pagination.lastPage()" class="last-page-numb-holder">
                    <span>...</span>
                    <span ng-click="pagination.jumpTo(pagination.lastPage())" class="pagination-number">{{pagination.lastPage()}}</span>
                </span>
            </div>
            <div class="navigation-button-holder three columns">
                <div ng-class="{disabled: pagination.isLastPage()}" ng-click="pagination.next()"
                class="btn waves-effect waves-green gg-golden-background">Siguiente</div>
            </div>
        </div>
        <!-- ======================================================================= -->
        <!-- ADD PRODUCER MODAL -->
        <!-- ======================================================================= -->
        <!-- Modal Trigger -->
        <div class="add-new-button">
            <a class="modal-action waves-effect waves-green btn gg-golden-background" ng-click="openAddNewProducerModal()"
            data-target='addNewProducer' modal open="addNewProducerModalOpen">Agregar un fabricante</a>
        </div>
        <!-- Modal Structure -->
        <div id="addNewProducer" class="modal modal-fixed-footer">
            <div class="modal-header">
                <div class="modal-close-container">
                    <i class="material-icons close-modal-button" ng-click="exitAddNewProducerModal();">close</i>
                </div>
            </div>
            <div class="modal-content">
                <h4>Fabricante</h4>
                <p>Ingrese los datos del fabricante</p>
                <div class="modal-body container" id="add-new-product-form">
                    <div input-field ng-class="{'invalid-input': producerIdExists}">
                        <input type="text" ng-model="producerBeingManaged.ID" ng-change="checkIfProducerIdExists(producerBeingManaged.ID)">
                        <label ng-class="{active: producerBeingManaged.ID}">
                            ID <span class="invalid-input-label" ng-if="producerIdExists">(La ID {{producerBeingManaged.ID}} ya existe)</span>
                        </label>
                    </div>
                    <div input-field>
                        <input type="text" ng-model="producerBeingManaged.name">
                        <label ng-class="{active: producerBeingManaged.name}">Nombre</label>
                    </div>
                    <div ng-model="producerBeingManaged.logo" rb-wp-gallery rb-wp-gallery-name="Imagen" rb-wp-gallery-button="Cambiar imagen"
                    rb-wp-gallery-placeholder="{{producerBeingManaged.logo}}"></div>
                    <div input-field>
                        <textarea ng-model="producerBeingManaged.information" class="materialize-textarea"></textarea>
                        <label ng-class="{active: producerBeingManaged.information}">Información</label>
                    </div>
                    <div input-field>
                        <input type="text" ng-model="producerBeingManaged.site">
                        <label ng-class="{active: producerBeingManaged.site}">Sitio web (URL)</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a class="modal-action waves-effect waves-green btn gg-golden-background" ng-click="modalAddNewProducerConfirmed()">Aceptar</a>
            </div>
        </div>
    </div>
    <!-- ======================================================================= -->
    <!--  EDIT PRODUCER MODAL -->
    <!-- ======================================================================= -->
    <!-- Modal Structure -->
    <div id="editProducerModal" class="modal modal-fixed-footer">
        <div class="modal-header">
            <div class="modal-close-container">
                <i class="material-icons close-modal-button" ng-click="exitEditProducerModal();">close</i>
            </div>
        </div>
        <div class="modal-content">
            <h4>{{producerToEdit.name}}</h4>
            <div class="modal-body container" id="new-page-form">
                <div input-field>
                    <input type="text" ng-model="producerToEditNewData.name">
                    <label ng-class="{active: producerToEditNewData.name}">Nombre</label>
                </div>
                <div input-field>
                    <textarea ng-model="producerToEditNewData.information" class="materialize-textarea"></textarea>
                    <label ng-class="{active: producerToEditNewData.information}">Información</label>
                </div>
                <div ng-model="producerToEditNewData.logo" rb-wp-gallery rb-wp-gallery-name="Logo" rb-wp-gallery-button="Cambiar imagen"
                rb-wp-gallery-placeholder="<?php echo $img_dir . '/placeholder.png'; ?>"></div>
                <div input-field>
                    <input type="text" ng-model="producerToEditNewData.site">
                    <label ng-class="{active: producerToEditNewData.site}">Sitio web (URL)</label>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <a class="modal-action waves-effect waves-green btn gg-golden-background" ng-click="saveProducerNewData()">Aceptar</a>
        </div>
    </div>

    <!-- ======================================================================= -->
    <!-- REMOVE PRODUCT CONFIRMATION -->
    <!-- ======================================================================= -->
    <div id="removeProducerModal" class="modal">
        <div class="modal-header">
            <div class="modal-close-container">
                <i class="material-icons close-modal-button" ng-click="exitRemoveProducerModal()">close</i>
            </div>
        </div>
        <div class="modal-content">
            <h4>Esta por eliminar el fabricante "{{producerBeingManaged.name}}"</h4>
            <p>¿Desea continuar?</p>
        </div>
        <div class="modal-footer no-padding">
            <a class="full-size-button no-margin modal-action waves-effect waves-red btn-flat gg-golden-background" ng-click="modalRemoveProducerConfirmed();">ACEPTAR</a>
        </div>
    </div>
</div>
