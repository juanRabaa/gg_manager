<?php
define('WP_USE_THEMES', false);
require('../../../../../wp-load.php');
$page_creator_dir = get_template_directory_uri() . '/page-creator';
$img_dir = $page_creator_dir . "/assets/img";
?>
<div id="sortable-effect-background" ng-class="{'sorting-enabled': !sortableOptions.disabled}"></div>
<div id="gg-page-creator-content" class="container" ng-class="{'sorting-enabled': !sortableOptions.disabled}">
    <div class="panel-header"> Pagina principal: </div>
    <div id="current-page" class="container"><span ng-if="!sortableOptions.disabled">Organizando: </span>{{currentPage.name}}</div>

    <div id="lists-controls">
        <a ng-if="sortableOptions.disabled" ng-show="pagesHistory.length() > 1" class="waves-effect waves-light btn gg-golden-background" ng-click="pagesHistory.goBack()">
             <i class="material-icons">chevron_left</i>
             <span>{{pagesHistory.history[pagesHistory.length() - 2].name}}</span>
        </a>
        <i ng-if="sortableOptions.disabled" id="sort-lists-button" class="fas fa-sort btn waves-effect waves-light gg-golden-background"
        tooltipped data-position="top" data-delay="1000" data-tooltip="Reorganizar" ng-click="enableSorting()"></i>
        <i ng-if="!sortableOptions.disabled" id="sort-lists-button" class="fas fa-check btn waves-effect waves-light waves-green"
        tooltipped data-position="top" data-delay="1000" data-tooltip="Terminar" ng-click="endSorting()"></i>
    </div>
    <!-- ======================================================================= -->
    <!--  PAGES CONTROLS, VIEWS, EDITION-->
    <!-- ======================================================================= -->
    <div id="pages-controls-loaded" ng-if="!pagesFactory.loading">
        <div id="button-controls-container" ng-if="currentPage.page_type == 'category_page' || currentPage.page_type == 'base_page'">
            <ul id="buttons-holder" ui-sortable="sortableOptions" ng-model="currentButtons" class="buttons-holder collapsible popout" data-collapsible="accordion">
                <!-- =============================================================== -->
                <!-- Buttons ng-repeat -->
                <li ng-if="currentPage.buttons_type == 'no_image'" data-button-id="{{button.ID}}" ng-class="{'not-visible-page': button.visibility == false}" class="rb-bullet-draggable buttons-list-item"
                ng-repeat="button in currentButtons">
                	<span class="rb-draggable-ball"></span>
        			<div class="row rb-collapsible-title rb-draggable-li-title collapsible-header button-header button-header-full-controls no-padding gg-golden-background">
                        <div class="product-quick-info nine columns">
                            <div class="nine columns button-name">
                                <span>{{button.name}}</span>
                            </div>
                        </div>
                        <div class="three columns row button-controls full-button-controls not-collapse" ng-click="$event.stopPropagation()">
                            <i tooltipped data-position="top" data-delay="1000" data-tooltip="Ocultar"
                            ng-class=" button.visibility ? 'fa-eye-slash' : 'fa-eye'"
                            class="fas six columns not-collapse edit-button gg-cyan-background btn waves-effect waves-light hover-tilt tooltipped" aria-hidden="true"
                            ng-click="button.visibility = !button.visibility;"></i>
                            <i tooltipped data-position="top" data-delay="1000" data-tooltip="Editar contenido"
                            class="fas fa-pencil-alt six columns not-collapse edit-button gg-green-background btn waves-effect waves-light hover-tilt" aria-hidden="true"
                            ng-click="changeToPage(button.ID, true, true);"></i>
                            <i tooltipped data-position="top" data-delay="1000" data-tooltip="Borrar"
                            class="fas fa-box-open six columns not-collapse delete-button gg-red-background btn waves-effect waves-light hover-tilt" aria-hidden="true"
                            ng-click="openRemoveButtonModal(button)" data-target='removeButtonModal' modal open="removeButtonOpen"></i>
                        </div>
        			</div>
        			<div class="rb-collapsible-body collapsible-body">
                        <form ng-model="button" form-on-change="manageSavingQueue">
                            <div input-field>
                                <input type="text" ng-model="button.name">
                                <label ng-class="{active: button.name}">Nombre</label>
                            </div>
                            <div input-field>
                                <select class="" ng-model="button.page_type" material-select watch>
                                    <option ng-repeat="type in pageTypes" value="{{type.value}}">{{type.name}}</option>
                                </select>
                                <label>Tipo de pagina</label>
                            </div>
                            <div input-field ng-show="button.page_type != 'final_page'" >
                                <select ng-model="button.buttons_type" material-select watch>
                                    <option ng-repeat="type in buttonsTypes" value="{{type.value}}">{{type.name}}</option>
                                </select>
                                <label>Diseño botones</label>
                            </div>
                            <div input-field>
                                <textarea ng-model="button.description" class="materialize-textarea"></textarea>
                                <label ng-class="{active: button.description}">Descripcion</label>
                            </div>
                            <div class="visibility-checkbox">
                                <label>
                                    <input type="checkbox" ng-model="button.visibility" ng-checked="button.visibility == 1 || button.visibility == true">
                                    <span>Visible al publico</span>
                                </label>
                            </div>
                        </form>
        	        </div>
        		</li>
                <!-- =============================================================== -->
                <!-- Buttons ng-repeat -->
                <!-- =============================================================== -->
                <li ng-if="currentPage.buttons_type == 'side_image' || currentPage.buttons_type == 'huge_image'" data-button-id="{{button.ID}}" ng-class="{'not-visible-page': button.visibility == false}" class="rb-bullet-draggable buttons-list-item"
                ng-repeat="button in currentButtons">
                	<span class="rb-draggable-ball"></span>
        			<div class="row rb-collapsible-title rb-draggable-li-title collapsible-header button-header button-header-full-controls no-padding gg-golden-background">
                        <div class="product-quick-info nine columns">
                            <div class="three columns button-image" style="background-image: url({{button.image}});"></div>
                            <div class="six columns button-name">
                                <span>{{button.name}}</span>
                            </div>
                        </div>
                        <div class="three columns row button-controls full-button-controls not-collapse" ng-click="$event.stopPropagation()">
                            <i tooltipped data-position="top" data-delay="1000" data-tooltip="{{button.visibility ? 'Ocultar' : 'Mostrar'}}"
                            ng-class="button.visibility ? 'fa-eye-slash' : 'fa-eye'"
                            class="fas six columns not-collapse edit-button gg-cyan-background btn waves-effect waves-light hover-tilt tooltipped" aria-hidden="true"
                            ng-click="button.visibility = !button.visibility;"></i>
                            <i tooltipped data-position="top" data-delay="1000" data-tooltip="Editar contenido"
                            class="fas fa-pencil-alt six columns not-collapse edit-button gg-green-background btn waves-effect waves-light hover-tilt" aria-hidden="true"
                            ng-click="changeToPage(button.ID, true, true);"></i>
                            <i tooltipped data-position="top" data-delay="1000" data-tooltip="Borrar"
                            class="fas fa-box-open six columns not-collapse delete-button gg-red-background btn waves-effect waves-light hover-tilt" aria-hidden="true"
                            ng-click="openRemoveButtonModal(button)" data-target='removeButtonModal' modal open="removeButtonOpen"></i>
                        </div>
        			</div>
        			<div class="rb-collapsible-body collapsible-body">
                        <form ng-model="button" form-on-change="manageSavingQueue">
                            <div input-field>
                                <input type="text" ng-model="button.name">
                                <label ng-class="{active: button.name}">Nombre</label>
                            </div>
                            <div input-field>
                                <select class="" ng-model="button.page_type" material-select watch>
                                    <option ng-repeat="type in pageTypes" value="{{type.value}}">{{type.name}}</option>
                                </select>
                                <label>Tipo de pagina</label>
                            </div>
                            <div input-field ng-show="button.page_type != 'final_page'" >
                                <select ng-model="button.buttons_type" material-select watch>
                                    <option ng-repeat="type in buttonsTypes" value="{{type.value}}">{{type.name}}</option>
                                </select>
                                <label>Diseño botones</label>
                            </div>
                            <div input-field>
                                <textarea ng-model="button.description" class="materialize-textarea"></textarea>
                                <label ng-class="{active: button.description}">Descripcion</label>
                            </div>
                            <div ng-model="button.image" rb-wp-gallery rb-wp-gallery-name="Imagen" rb-wp-gallery-button="Cambiar imagen"
                            rb-wp-gallery-placeholder="<?php echo $img_dir . '/placeholder.png'; ?>"></div>
                            <div class="visibility-checkbox">
                                <label>
                                    <input type="checkbox" ng-model="button.visibility" ng-checked="button.visibility == 1 || button.visibility == true">
                                    <span>Visible al publico</span>
                                </label>
                            </div>
                        </form>
        	        </div>
        		</li>
        	</ul>


            <!-- ======================================================================= -->
            <!-- ADD PAGE MODAL -->
            <!-- ======================================================================= -->
            <!-- Modal Trigger -->
        	<div class="add-new-button">
        		<i class="fas fa-plus" data-target='addNewModal' modal open="newButtonModalOpen" ng-click="openNewButtonModal()"></i>
        	</div>
            <!-- Modal Structure -->
            <div id="addNewModal" class="modal">
                <div class="modal-content">
                    <h4>Agregar nueva pagina</h4>
                    <p>A bunch of text</p>
                </div>
                <div class="modal-body container" id="new-page-form">
                    <div input-field>
                        <input type="text" ng-model="newButton.ID">
                        <label ng-class="{active: newButton.ID}">ID</label>
                    </div>
                    <div input-field>
                        <input type="text" ng-model="newButton.name">
                        <label ng-class="{active: newButton.name}">Nombre</label>
                    </div>
                    <div ng-model="newButton.image" ng-if="currentPage.buttons_type != 'no_image'" rb-wp-gallery rb-wp-gallery-name="Imagen"
                    rb-wp-gallery-placeholder="<?php echo $img_dir . '/placeholder.png'; ?>"></div>
                    <div input-field>
                        <textarea rows="4" ng-model="newButton.description" class="materialize-textarea"></textarea>
                        <label ng-class="{active: newButton.description}">Descripcion</label>
                    </div>
                    <div input-field>
                        <select class="" ng-model="newButton.page_type" material-select watch>
                            <option ng-repeat="type in pageTypes" value="{{type.value}}">{{type.name}}</option>
                        </select>
                        <label>Tipo de pagina</label>
                    </div>
                    <div input-field ng-show="newButton.page_type != 'final_page'" >
                        <select ng-model="newButton.buttons_type" material-select watch>
                            <option ng-repeat="type in buttonsTypes" value="{{type.value}}">{{type.name}}</option>
                        </select>
                        <label>Diseño botones</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <a class="modal-action waves-effect waves-green btn gg-golden-background" ng-click="insertNewButton()">Aceptar</a>
                </div>
            </div>
            <!-- ADD PAGE END -->

            <!-- ======================================================================= -->
            <!-- REMOVE BUTTON CONFIRMATION -->
            <!-- ======================================================================= -->
            <div id="removeButtonModal" class="modal">
                <div class="modal-header">
                    <div class="modal-close-container">
                        <i class="material-icons close-modal-button" ng-click="closeRemoveButtonModal()">close</i>
                    </div>
                </div>
                <div class="modal-content">
                    <h4>Esta por borrar una pagina</h4>
                    <p>¿Desea continuar?</p>
                </div>
                <div class="modal-footer no-padding">
                    <a class="full-size-button no-margin modal-action waves-effect waves-red btn-flat gg-golden-background" ng-click="deleteButtonConfirmed();">ACEPTAR</a>
                </div>
            </div>
        </div>


        <!-- ======================================================================= -->
        <!--  PRODUCTS CONTROLS, VIEWS, EDITION-->
        <!-- ======================================================================= -->
        <div id="products-edition-controls" ng-if="currentPage.page_type == 'final_page'">

            <ul id="buttons-holder" ui-sortable="sortableOptions" ng-model="currentProducts" class="buttons-holder collapsible popout" data-collapsible="accordion">
                <!-- =============================================================== -->
                <!-- Products ng-repeat -->
                <!-- =============================================================== -->
                <li data-product-id="{{pageProductInfo.product_object.ID}}" class="rb-bullet-draggable buttons-list-item" ng-repeat="pageProductInfo in currentProducts" ng-class="{'not-visible-page': pageProductInfo.visibility == false}">
        			<div class="row rb-collapsible-title rb-draggable-li-title collapsible-header button-header button-header-full-controls no-padding gg-golden-background">
                        <div class="three columns product-image" style="background-image: url({{prodPageRelationImage(pageProductInfo)}});">
                        </div>
                        <div class="seven columns button-name">
                            <span>{{prodPageRelationName(pageProductInfo)}}</span>
                        </div>
                        <div class="two columns row button-controls full-button-controls not-collapse" ng-click="$event.stopPropagation()">
                            <i tooltipped data-position="top" data-delay="1000" data-tooltip="Ocultar"
                            ng-class=" pageProductInfo.visibility ? 'fa-eye-slash' : 'fa-eye'"
                            class="fas six columns not-collapse edit-button gg-cyan-background btn waves-effect waves-light hover-tilt tooltipped" aria-hidden="true"
                            ng-click="pageProductInfo.visibility = !pageProductInfo.visibility ;"></i>
                            <i tooltipped data-position="top" data-delay="1000" data-tooltip="Borrar"
                            class="fas fa-box-open six columns not-collapse delete-button gg-red-background btn waves-effect waves-light hover-tilt" aria-hidden="true"
                            ng-click="openRemoveProductModal(pageProductInfo)" data-target='removeProductModal' modal open="removeProductOpen"></i>
                        </div>
        			</div>
        			<div class="rb-collapsible-body collapsible-body product-local-edition">
                        <div class="visibility-checkbox">
                            <label>
                                <input type="checkbox" ng-model="pageProductInfo.use_prod_name" ng-checked="pageProductInfo.use_prod_name">
                                <span>Usar nombre del producto</span>
                            </label>
                        </div>
                        <div ng-if="pageProductInfo.use_prod_name" input-field>
                            <input disabled type="text" value="{{pageProductInfo.product_object.name}}">
                        </div>
                        <div ng-if="!pageProductInfo.use_prod_name" input-field>
                            <input type="text" ng-model="pageProductInfo.name">
                            <label ng-class="{active: pageProductInfo.name}">Nombre</label>
                        </div>

                        <div class="visibility-checkbox">
                            <label>
                                <input type="checkbox" ng-model="pageProductInfo.use_prod_image" ng-checked="pageProductInfo.use_prod_image">
                                <span>Usar image del producto</span>
                            </label>
                        </div>
                        <div disabled ng-if="pageProductInfo.use_prod_image" rb-wp-gallery rb-wp-gallery-name="Imagen"
                        rb-wp-gallery-placeholder="<?php echo $img_dir . '/placeholder.png'; ?>"></div>
                        <div ng-if="!pageProductInfo.use_prod_image" ng-model="pageProductInfo.image" rb-wp-gallery rb-wp-gallery-name="Imagen" rb-wp-gallery-button="Cambiar imagen"
                        rb-wp-gallery-placeholder="<?php echo $img_dir . '/placeholder.png'; ?>"></div>

                        <div class="visibility-checkbox">
                            <label>
                                <input type="checkbox" ng-model="pageProductInfo.use_prod_description" ng-checked="pageProductInfo.use_prod_description">
                                <span>Usar descripcion del producto</span>
                            </label>
                        </div>
                        <div ng-if="pageProductInfo.use_prod_description" input-field>
                            <textarea disabled ng-model="" class="materialize-textarea" value="{{pageProductInfo.product_object.description}}"></textarea>
                        </div>
                        <div ng-if="!pageProductInfo.use_prod_description" input-field>
                            <textarea ng-model="pageProductInfo.description" class="materialize-textarea"></textarea>
                            <label ng-class="{active: pageProductInfo.description}">Descripcion</label>
                        </div>
        	        </div>
        		</li>
        	</ul>


            <!-- ======================================================================= -->
            <!-- ADD PRODUCT MODAL -->
            <!-- ======================================================================= -->
            <!-- Modal Trigger -->
            <div class="add-new-button">
                <a class="modal-action waves-effect waves-green btn gg-golden-background" ng-click="openAddProductModal()"
                data-target='addNewPage' modal open="addProductModalOpen">Agregar un producto</a>
            </div>
            <!-- Modal Structure -->
            <div id="addNewPage" class="modal modal-fixed-footer">
                <div class="modal-content">
                    <h4>Producto</h4>
                    <p>Elija el producto que quiere agregar</p>
                    <div class="modal-body container" id="new-page-form">
                        <div input-field>
                            <input type="text" ng-model="productSearchForm.query">
                            <label ng-class="{active: productSearchForm.query}">Buscar producto</label>
                        </div>
                        <li class="product-to-add" ng-repeat="product in productsTrunk | filter : {'name' : productSearchForm.query}
                        | orderBy:'name' | filter : productsToAddFilter ">
                            <i ng-click="insertSingleProduct(product)" class="fas fa-plus remove-prod-placeholder btn gg-green-background waves-effect waves-light"></i>
                            <img class="responsive-img product-image" src="{{product.image}}"/>
                            <span class="product-name">{{product.name}}</span>
                        </li>
                        <!-- <angucomplete-alt id="ex2"
                          placeholder="Buscar producto"
                          pause="300"
                          clear-selected="false"
                          selected-object="updateToAddProducts"
                          local-data="productsTrunk"
                          title-field="name"
                          image-field="image"
                          search-fields="name"
                          minlength="1"
                          input-class="form-control form-control-small"
                          text-no-results="No se encontro el producto"
                          text-searching="Buscando..."
                          match-class="highlight">
                         </angucomplete-alt>
                         <ul>
                             <li class="product-to-add" ng-repeat="product in productsToAdd">
                                 <i ng-click="removeProductsToAdd(product.ID)" class="fas fa-trash-alt remove-prod-placeholder btn gg-red-background waves-effect waves-light"></i>
                                 <img class="responsive-img product-image" src="{{product.image}}"/>
                             </li>
                         </ul>                      -->
                    </div>
                </div>
                <div class="modal-footer">
                    <a class="modal-action waves-effect waves-green btn gg-golden-background" ng-click="closeAddProductModal()">Terminar</a>
                </div>
            </div>
            <!-- ADD PAGE END -->

            <!-- ======================================================================= -->
            <!-- REMOVE PRODUCT CONFIRMATION -->
            <!-- ======================================================================= -->
            <div id="removeProductModal" class="modal">
                <div class="modal-header">
                    <div class="modal-close-container">
                        <i class="material-icons close-modal-button" ng-click="closeRemoveProductModal()">close</i>
                    </div>
                </div>
                <div class="modal-content">
                    <h4>Esta por quitar este producto de la pagina {{currentPage.name}}</h4>
                    <p>¿Desea continuar?</p>
                </div>
                <div class="modal-footer no-padding">
                    <a class="full-size-button no-margin modal-action waves-effect waves-red btn-flat gg-golden-background" ng-click="modalRemoveProductConfirmed();">ACEPTAR</a>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 
<script type="text/ng-template"  id="tree_item_renderer.html">
    {{data.name}}
    <ul>
        <li ng-repeat="data in data.childPagesObj" ng-include="'tree_item_renderer.html'"></li>
    </ul>
</script>

<ul>
    <li ng-repeat="data in pagesTree" ng-include="'tree_item_renderer.html'"></li>
</ul>

<div id="pages-tree">

</div> -->
