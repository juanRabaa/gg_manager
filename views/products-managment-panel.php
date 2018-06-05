<?php
define('WP_USE_THEMES', false);
require('../../../../../wp-load.php');
$page_creator_dir = get_template_directory_uri() . '/page-creator';
$img_dir = $page_creator_dir . "/assets/img";
?>
<div id="gg-product-managment">
    <div class="panel-header">Productos</div>
    <div id="product-list-holder">
        <!-- =============================================================== -->
        <!-- FILTERS -->
        <!-- =============================================================== -->
        <div id="products-list-filters" class="row">
            <div class="row">
                <div class="six columns" input-field>
                    <input type="text" ng-model="productsFilters.name">
                    <label ng-class="{active: productsFilters.name}">Nombre</label>
                </div>
                <div class="six columns" input-field>
                    <select ng-model="productsFilters.orderBy" material-select watch>
                        <option ng-if="productsFilters.orderBy == option.value" ng-repeat="option in productsFilters.orderOption" value="{{option.value}}" selected>{{option.niceName}}</option>
                        <option ng-if="productsFilters.orderBy != option.value" ng-repeat="option in productsFilters.orderOption" value="{{option.value}}" selected>{{option.niceName}}</option>
                    </select>
                    <label>Order por</label>
                </div>
            </div>
            <div class="row">
                <div class="twelve columns" input-field>
                    <select ng-model="productsFilters.toShow" material-select watch>
                        <option ng-if="productsFilters.toShow == option.value" ng-repeat="option in productsFilters.showOption" value="{{option.value}}" selected>{{option.niceName}}</option>
                        <option ng-if="productsFilters.toShow != option.value" ng-repeat="option in productsFilters.showOption" value="{{option.value}}" selected>{{option.niceName}}</option>
                    </select>
                    <label>Mostrar</label>
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
        <!-- PRODUCTS LIST -->
        <!-- =============================================================== -->
        <ul id="products-list">
            <li class="product-item row" ng-repeat="product in ( productsFilters.filteredProducts = ( productsFactory.products
            | filter : { name: productsFilters.name} | filter : productsFilters.showOptionFilter | orderBy: productsFilters.orderBy
            ) | limitTo: pagination.amountPerPage : pagination.from() )" ng-class="{'disabled-product': !product.enabled}">
                <div class="product-item-image two columns">
                    <img class="responsive-img" src="{{product.image}}">
                </div>
                <div class="product-item-id two columns">{{product.ID}}</div>
                <div class="product-item-name six columns">{{product.name}}</div>
                <div class="product-item-controls two columns">
                    <!-- <i tooltipped data-position="top" data-delay="1000" data-tooltip="Deshabilitar"
                    ng-class="product.enabled ? 'fa-eye-slash' : 'fa-eye'"
                    class="fas six columns not-collapse edit-button gg-cyan-background btn waves-effect waves-light hover-tilt tooltipped" aria-hidden="true"
                    ng-click="product.enabled = !product.enabled;"></i> -->
                    <i tooltipped data-position="top" data-delay="1000" data-tooltip="Editar producto"
                    class="fas fa-pencil-alt six columns not-collapse edit-button gg-green-background btn waves-effect waves-light hover-tilt" aria-hidden="true"
                    ng-click="openEditProductModal(product);" data-target='editProductModal' modal open="editProductModalOpen"></i>
                    <i tooltipped data-position="top" data-delay="1000" data-tooltip="Borrar"
                    class="fas fa-box-open six columns not-collapse delete-button gg-red-background btn waves-effect waves-light hover-tilt" aria-hidden="true"
                    ng-click="openRemoveProductModal(product)" data-target='removeProductModal' modal open="removeProductModalOpen"></i>
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
        <!-- ADD PRODUCT MODAL -->
        <!-- ======================================================================= -->
        <!-- Modal Trigger -->
        <div class="add-new-button">
            <a class="modal-action waves-effect waves-green btn gg-golden-background" ng-click="openAddNewProductModal()"
            data-target='addNewProduct' modal open="addNewProductModalOpen">Agregar un producto</a>
        </div>
        <!-- Modal Structure -->
        <div id="addNewProduct" class="modal modal-fixed-footer">
            <div class="modal-header">
                <div class="modal-close-container">
                    <i class="material-icons close-modal-button" ng-click="exitAddNewProductModal();">close</i>
                </div>
            </div>
            <div class="modal-content">
                <h4>Producto</h4>
                <p>Ingrese los datos del producto</p>
                <div class="modal-body container" id="add-new-product-form">
                    <div input-field ng-class="{'invalid-input': productIdExists}">
                        <input type="text" ng-model="productBeingManaged.ID" ng-change="checkIfProductIdExists(productBeingManaged.ID)">
                        <label ng-class="{active: productBeingManaged.ID}">
                            ID <span class="invalid-input-label" ng-if="productIdExists">(La ID {{productBeingManaged.ID}} ya existe)</span>
                        </label>
                    </div>
                    <div input-field>
                        <input type="text" ng-model="productBeingManaged.name">
                        <label ng-class="{active: productBeingManaged.name}">Nombre</label>
                    </div>
                    <div ng-model="productBeingManaged.image" rb-wp-gallery rb-wp-gallery-name="Imagen" rb-wp-gallery-button="Cambiar imagen"
                    rb-wp-gallery-placeholder="{{productBeingManaged.image}}"></div>
                    <div input-field>
                        <textarea ng-model="productBeingManaged.description" class="materialize-textarea"></textarea>
                        <label ng-class="{active: productBeingManaged.description}">Descripcion</label>
                    </div>
                    <!-- <div class="row">
                        <label class="form-label">Producto padre</label>
                        <div class="parent-product row">
                            <div class="six columns">
                                <img src="http://localhost/wordpress2/htdocs/wp-content/uploads/2018/06/Bianconero-box.png" class="responsive-img">
                            </div>
                            <div class="six columns">
                                    <p> Nombre </p>
                                <p> Datos </p>
                            </div>
                        </div>
                        <div class="gg-green-background btn waves-effect waves-light">Seleccionar producto</div>
                    </div> -->
                    <div class="row">
                        <label class="form-label">Producto padre</label>
                        <div input-field>
                            <input type="text" ng-model="parentSearch.query">
                            <label ng-class="{active: parentSearch.query}">Buscar</label>
                        </div>
                        <div class="parent-products-list-container">
                            <ul class="parent-product-list">
                                <li class="parent-product-list-item" ng-repeat="product in productsFactory.products | filter : parentSearch.query"
                                ng-class="{selected: productBeingManaged.parent_product_ID == product.ID}" ng-click="toggleParentProduct(product.ID)">
                                    <div class="parent-product-image-container">
                                        <img src="{{product.image}}"/>
                                    </div>
                                    <span class="parent-product-name">{{product.name}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div input-field>
                        <input type="number" min=0 ng-model="productBeingManaged.price_pesos">
                        <label ng-class="{active: productBeingManaged.price_pesos}">Precio (pesos)</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a class="modal-action waves-effect waves-green btn gg-golden-background" ng-click="modalAddNewProductConfirmed()">Aceptar</a>
            </div>
        </div>
    </div>
    <!-- ======================================================================= -->
    <!-- DISABLE PRODUCT CONFIRMATION -->
    <!-- ======================================================================= -->
    <!-- <div id="disableProductModal" class="modal">
        <div class="modal-header">
            <div class="modal-close-container">
                <i class="material-icons close-modal-button" ng-click="closeDisableProductModal()">close</i>
            </div>
        </div>
        <div class="modal-content">
            <h4>Esta por deshabilitar el producto {{productToDisable.name}}</h4>
            <p>¿Desea continuar?</p>
        </div>
        <div class="modal-footer no-padding">
            <a class="full-size-button no-margin modal-action waves-effect waves-red btn-flat gg-golden-background" ng-click="disableProductConfirmed();">ACEPTAR</a>
        </div>
    </div> -->
    <!-- ======================================================================= -->
    <!--  EDIT PRODUCT MODAL -->
    <!-- ======================================================================= -->
    <!-- Modal Structure -->
    <div id="editProductModal" class="modal modal-fixed-footer">
        <div class="modal-header">
            <div class="modal-close-container">
                <i class="material-icons close-modal-button" ng-click="exitEditProductModal();">close</i>
            </div>
        </div>
        <div class="modal-content">
            <h4>{{productToEdit.name}}</h4>
            <div class="modal-body container" id="new-page-form">
                <div input-field>
                    <input type="text" ng-model="productToEditNewData.name">
                    <label ng-class="{active: productToEditNewData.name}">Nombre</label>
                </div>
                <div input-field>
                    <textarea ng-model="productToEditNewData.description" class="materialize-textarea"></textarea>
                    <label ng-class="{active: productToEditNewData.description}">Descripcion</label>
                </div>
                <div ng-model="productToEditNewData.image" rb-wp-gallery rb-wp-gallery-name="Imagen principal" rb-wp-gallery-button="Cambiar imagen"
                rb-wp-gallery-placeholder="<?php echo $img_dir . '/placeholder.png'; ?>"></div>
                <div class="visibility-checkbox">
                    <label>
                        <input type="checkbox" ng-model="productToEditNewData.enabled" ng-checked="productToEditNewData.enabled">
                        <span>Habilitado</span>
                    </label>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <a class="modal-action waves-effect waves-green btn gg-golden-background" ng-click="saveProductNewData()">Aceptar</a>
        </div>
    </div>

    <!-- ======================================================================= -->
    <!-- REMOVE PRODUCT CONFIRMATION -->
    <!-- ======================================================================= -->
    <div id="removeProductModal" class="modal">
        <div class="modal-header">
            <div class="modal-close-container">
                <i class="material-icons close-modal-button" ng-click="exitRemoveProductModal()">close</i>
            </div>
        </div>
        <div class="modal-content">
            <h4>Esta por eliminar el producto "{{productBeingManaged.name}}"</h4>
            <p>¿Desea continuar?</p>
        </div>
        <div class="modal-footer no-padding">
            <a class="full-size-button no-margin modal-action waves-effect waves-red btn-flat gg-golden-background" ng-click="modalRemoveProductConfirmed();">ACEPTAR</a>
        </div>
    </div>
</div>
