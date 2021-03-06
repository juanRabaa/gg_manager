<?php
define('WP_USE_THEMES', false);
require('../../../../../wp-load.php');
$page_creator_dir = get_template_directory_uri() . '/page-creator';
$img_dir = $page_creator_dir . "/assets/img";
?>
<div id="sortable-effect-background" ng-class="{'sorting-enabled': !sortableOptions.disabled}"></div>
<!-- =============================================================================
// BEGGINING SECTION
// ============================================================================= -->
<div ng-if="!pagesFactory.basePage.wp_page_ID" id="gg-page-creator-content" class="container beggining-section" ng-class="{'sorting-enabled': !sortableOptions.disabled}">
    <h4 class="center">Bienvenido al administrador de paginas de Gala Gourmet</h4>
    <p>En este panel podra organizar las paginas de los productos</p>
    <p>Aún sin haber asigndado una pagina principal, todavia puede administrar los productos desde la seccion de productos</p>
    <p>Para comenzar, debe elegir la pagina principal en la cual comenzara la seccion de productos</p>
    <!-- Modal Trigger -->
    <div class="btn gg-golden-background waves" data-target='selectBasePage' modal open="selectBasePageModalOpen"
    ng-click="openSelectBasePageModal()">Elegir pagina principal</div>
    <!-- Modal Trigger -->
    <div class="btn gg-golden-background waves" data-target='createBasePage' modal open="createBasepageModalOpen"
    ng-click="openCreateBasepageModal()">Crear una nueva pagina</div>
    <!-- ======================================================================= -->
    <!-- SELECT BASE PAGE -->
    <!-- ======================================================================= -->
    <!-- Modal Structure -->
    <div id="createBasePage" class="modal modal-fixed-footer">
        <div class="modal-content">
            <h4>Crear pagina principal</h4>
            <p>La pagina que elija usara un template especial, en el cual se mostrara las categorias principales</p>
            <div class="modal-body container" id="base-page-selection">
                <ul>
                    <!-- {{wordpressPages}} -->
                    <li ng-repeat="wpPage in wordpressPages" ng-click="basePageSelection.selectedPage = wpPage"
                    ng-class="{'animated-background-color': basePageSelection.selectedPage.ID == wpPage.ID}">{{wpPage.post_title}}</li>
                </ul>
            </div>
        </div>
        <div class="modal-footer">
            <a class="modal-action waves-effect waves-green btn gg-golden-background" ng-click="createBasePageModalConfirmed()">Aceptar</a>
        </div>
    </div>
    <!-- MODAL END -->
    <!-- ======================================================================= -->
    <!-- CREATE BASE PAGE -->
    <!-- ======================================================================= -->
    <!-- Modal Structure -->
    <div id="selectBasePage" class="modal modal-fixed-footer">
        <div class="modal-content">
            <h4>Seleccionar pagina principal</h4>
            <p>La pagina que elija usara un template especial, en el cual se mostrara las categorias principales</p>
            <div class="modal-body container" id="base-page-selection">
                <ul>
                    <!-- {{wordpressPages}} -->
                    <li ng-repeat="wpPage in wordpressPages" ng-click="basePageSelection.selectedPage = wpPage"
                    ng-class="{'animated-background-color': basePageSelection.selectedPage.ID == wpPage.ID}">{{wpPage.post_title}}</li>
                </ul>
            </div>
        </div>
        <div class="modal-footer">
            <a class="modal-action waves-effect waves-green btn gg-golden-background" ng-click="selectBasePageModalConfirmed()">Aceptar</a>
        </div>
    </div>
    <!-- ADD PAGE END -->
</div>

<!-- // =============================================================================
// LOST PAGES ADMINISTRATION
// ============================================================================= -->
<div id="gg-lost-pages" ng-if="pagesFactory.basePage.wp_page_ID && pagesFactory.pagesNotRelatedWithWpPages.length > 0">
    <h1 class="center">Ups!</h1>
    <p>No se encontraron la pagina de wordpress de algunas de las categorías</p>
    <p>Si hay paginas hijas que tambien se encuentren en esta situacion, se actualizaran al actualizar el padre</p>
    <p>Seleccione que quiere hacer con estas paginas, si el error persiste, o tiene alguna duda, comuníquese con soporte</p>
    <h4 class="center">Paginas</h1>
    <div class="general-controls row center">
        <div class="six columns btn gg-green-background btn waves-effect waves-light hover-tilt" ng-click="generateAllLostPages()">Agregar todas</div>
        <div class="six columns btn gg-red-background btn waves-effect waves-light hover-tilt">Borrar todas</div>
    </div>
    <ul id="lost-pages-list" class="golden-list">
        <li class="row" ng-repeat="page in pagesFactory.pagesNotRelatedWithWpPages" ng-if="!pagesFactory.isNotRelatedChild(page)">
            <div class="six columns">{{page.name}}</div>
            <div class="six columns controls">
                <i tooltipped data-position="top" data-delay="1000" data-tooltip="Generar pagina"
                class="fas fa-check six columns not-collapse gg-green-background btn waves-effect waves-light hover-tilt"
                ng-click="generatePagesRecursively(page);"></i>
                <i tooltipped data-position="top" data-delay="1000" data-tooltip="Borrar"
                class="fas fa-trash six columns not-collapse delete-button gg-red-background btn waves-effect waves-light hover-tilt"
                ng-click="deleteButton(page)" data-target='removeButtonModal' modal open="removeButtonOpen"></i>
            </div>
        </li>
    </ul>
</div>

<!-- // =============================================================================
// PAGES ADMINISTRATION SECTION
// ============================================================================= -->
<div ng-if="pagesFactory.basePage.wp_page_ID && pagesFactory.pagesNotRelatedWithWpPages.length == 0" id="gg-page-creator-content" class="container" ng-class="{'sorting-enabled': !sortableOptions.disabled}">
    <div id="top-controlls">
        <a ng-if="currentPage.page_type == 'final_page'" class="modal-action waves-effect waves-green btn gg-golden-background">Diseño</a>
    </div>
    <!-- <div ng-if="currentPage.page_type == 'base_page'" class="panel-header"> Pagina principal: {{basePage.name}}</div> -->
    <div id="current-page" class="container"><span ng-if="!sortableOptions.disabled">Organizando: </span>
        <img ng-if="currentPage.image" class="responsive-img" src="{{currentPage.image}}"/>{{currentPage.name}}
    </div>
    <p ng-if="currentPage.description" class="center">{{currentPage.description}}</p>
    <div id="lists-controls">
        <a ng-if="sortableOptions.disabled" ng-show="currentPage.parentPageObject" class="waves-effect waves-light btn gg-golden-background" ng-click="goBack()">
             <i class="material-icons">chevron_left</i>
             <span>{{currentPage.parentPageObject.name}}</span>
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
                            ng-click="button.visibility = !button.visibility; manageSavingQueue(button)"></i>
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
                            ng-click="button.visibility = !button.visibility; manageSavingQueue(button)"></i>
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
                            ng-click="pageProductInfo.visibility = !pageProductInfo.visibility; manageSavingQueue(pageProductInfo)"></i>
                            <i tooltipped data-position="top" data-delay="1000" data-tooltip="Borrar"
                            class="fas fa-box-open six columns not-collapse delete-button gg-red-background btn waves-effect waves-light hover-tilt" aria-hidden="true"
                            ng-click="openRemoveProductModal(pageProductInfo)" data-target='removeProductModal' modal open="removeProductOpen"></i>
                        </div>
        			</div>
        			<div class="rb-collapsible-body collapsible-body product-local-edition">
                        <form ng-model="pageProductInfo" form-on-change="manageSavingQueue">
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
                            rb-wp-gallery-placeholder="{{pageProductInfo.product_object.image}}"></div>
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
                        </form>
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
                        <li class="product-to-add" ng-repeat="product in productsFactory.products | filter : {'name' : productSearchForm.query}
                        | orderBy:'name' | filter : productsToAddFilter ">
                            <i ng-click="insertSingleProduct(product, $event)" class="fas fa-plus remove-prod-placeholder btn gg-green-background waves-effect waves-light"></i>
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
<!-- ======================================================================= -->
<!-- PAGES TREE -->
<!-- ======================================================================= -->
<div id="gg-pages-tree" ng-if="pagesFactory.basePage.wp_page_ID && pagesFactory.pagesNotRelatedWithWpPages.length == 0">
    <div class="trigger btn waves gg-golden-background" ng-click="pagesTree.activated = !pagesTree.activated">
        <i ng-if="!pagesTree.activated" class="material-icons" tooltipped data-position="top" data-delay="400" data-tooltip="Abrir árbol de paginas" >chevron_left</i>
        <i ng-if="pagesTree.activated" class="material-icons" tooltipped data-position="top" data-delay="400" data-tooltip="Cerrar árbol de paginas" >chevron_right</i>
    </div>
    <div ng-if="pagesTree.activated" class="tree">
        <script type="text/ng-template"  id="tree_item_renderer.html">
            <span ng-click="pagesTree.changeToPage(data.ID, $event);">{{data.name}}</span>
            <ul>
                <li ng-repeat="data in data.childPagesObj | filter : pagesTree.filters.recursiveNameFilter | orderBy:'name'"
                ng-class="{current: currentPage.ID == data.ID, 'spot-on': pagesTree.filters.name == data.name}" ng-include="'tree_item_renderer.html'"
                ng-click="changeToPage(data.ID, false, true); $event.stopPropagation();"></li>
            </ul>
        </script>
        <h4>Árbol de paginas</h4>
        <div input-field>
            <input autocomplete="new-password" type="text" ng-model="pagesTree.filters.name">
            <label ng-class="{active: pagesTree.filters.name}">Buscar...</label>
        </div>
        <ul>
            <li ng-repeat="data in pagesFactory.basePage.childPagesObj | filter : pagesTree.filters.recursiveNameFilter | orderBy:'name'"
            ng-class="{current: currentPage.ID == data.ID, 'spot-on': pagesTree.filters.name == data.name}" ng-include="'tree_item_renderer.html'"></li>
        </ul>
    </div>
</div>
