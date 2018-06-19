<?php



// =============================================================================
// Creating the metabox
// =============================================================================
/* Fire our meta box setup function on the post editor screen. */
add_action( 'load-post.php', 'gg_products_page_meta_boxes_setup' );
add_action( 'load-post-new.php', 'gg_products_page_meta_boxes_setup' );

/* Meta box setup function. */
function gg_products_page_meta_boxes_setup() {

  /* Add meta boxes on the 'add_meta_boxes' hook. */
  add_action( 'add_meta_boxes', 'gg_add_products_page_meta_boxes' );

  /* Save post meta on the 'save_post' hook. */
  add_action( 'save_post', 'smashing_save_post_class_meta', 10, 2 );
}

/* Create one or more meta boxes to be displayed on the post editor screen. */
function gg_add_products_page_meta_boxes() {

  add_meta_box(
    'gg_products_page_activated',      // Unique ID
    esc_html__( 'Gala Gourmet', 'example' ),    // Title
    'gg_products_page_meta_box',   // Callback function
    'page',         // Admin page (or post type)
    'side',         // Context
    'default'         // Priority
  );
}

/* Display the post meta box. */
function gg_products_page_meta_box( $post ) {
    wp_nonce_field( basename( __FILE__ ), 'gg_products_page_nonce' );
    $checked = "";
    $is_checked = boolval(esc_attr( get_post_meta( $post->ID, 'gg_products_page_activated', true ) ));
      if($is_checked)
          $checked = "checked";
  ?>
    <p>
      <label for="gg_products_page">Pagina de productos</label>
      <input class="widefat" type="checkbox" name="gg_products_page" id="gg_products_page" <?php echo $checked; ?>/>
    </p>
  <?php
}

/* Save the meta box's post metadata. */
function smashing_save_post_class_meta( $post_id, $post ) {

  /* Verify the nonce before proceeding. */
  if ( !isset( $_POST['gg_products_page_nonce'] ) || !wp_verify_nonce( $_POST['gg_products_page_nonce'], basename( __FILE__ ) ) )
    return $post_id;

  /* Get the post type object. */
  $post_type = get_post_type_object( $post->post_type );

  /* Check if the current user has permission to edit the post. */
  if ( !current_user_can( $post_type->cap->edit_post, $post_id ) )
    return $post_id;

  /* Get the posted data and sanitize it for use as an HTML class. */
  $new_meta_value = ( isset( $_POST['gg_products_page'] ) ? sanitize_html_class( $_POST['gg_products_page'] ) : '' );

  /* Get the meta key. */
  $meta_key = 'gg_products_page_activated';

  /* Get the meta value of the custom field key. */
  $meta_value = get_post_meta( $post_id, $meta_key, true );

  /* If a new meta value was added and there was no previous value, add it. */
  if ( $new_meta_value && '' == $meta_value )
    add_post_meta( $post_id, $meta_key, $new_meta_value, true );

  /* If the new meta value does not match the old value, update it. */
  elseif ( $new_meta_value && $new_meta_value != $meta_value )
    update_post_meta( $post_id, $meta_key, $new_meta_value );

  /* If there is no new meta value but an old value exists, delete it. */
  elseif ( '' == $new_meta_value && $meta_value )
    delete_post_meta( $post_id, $meta_key, $meta_value );
}


if (!is_admin()) {
    // =========================================================================
    // STYLES
    // =========================================================================
    wp_enqueue_style( "pages-template", $page_creator_dir . '/css/template/main.css', array() );
    wp_enqueue_style( "spinners", $page_creator_dir . '/css/spinners.css', array() );
    // =========================================================================
    // SCRIPTS
    // =========================================================================
    wp_enqueue_script( "jquery", "https://code.jquery.com/jquery-3.1.1.min.js", true );
    wp_enqueue_script( 'angularJS', "https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js", array("jquery"), true );
    wp_enqueue_script( 'angular-route', 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.9/angular-route.min.js', true );
    wp_enqueue_script( "gg-pages-angular", $page_creator_dir . '/js/template/pages-ajax.js', true );
    wp_localize_script( 'gg-pages-angular', 'wordpressData', array(
        'themeUrl'            => get_template_directory_uri(),
        'siteUrl'                  => get_site_url(null, '', 'https'),
        'nonce'             => wp_create_nonce( 'wp_rest' ),
    ) );
}

// =============================================================================
// Content filter
// =============================================================================
/*This part manages what happens when a page has the "products page" meta-box $checked.
It will replace the content of the page with the buttons and products from the administrator*/
function is_products_page($post_id){
    return get_post_meta( $post_id, 'gg_products_page_activated', true );
}

add_filter('the_content', function( $content ) use ($page_creator_dir, $img_dir){
    $post_id = get_the_ID();
    if ( is_products_page($post_id) ):
?>
    <div ng-app="ggPagesNavigation" ng-controller="pagesNavigation" ng-class="{loading: loadingManager.tickets.length > 0}">
        <div ng-show="loadingManager.isLoading()" id="gg-loading-box">
            <sk-cube-grid class="gg-spinner"></sk-cube-grid>
            <div>
                <p ng-repeat="ticket in loadingManager.tickets" class="loading-item">
                    <span class="gg-golden-background dot"></span>{{ticket.description}}
                </p>
            </div>
        </div>
        <div ng-show="!loadingManager.isLoading()">
            <div id="loading-info-debug">
                <div ng-repeat="ticket in loadingManager.tickets"><span>{{ticket.description}}</span></div>
            </div>
            <div>
                <div class="golden-button go-back" ng-click="goBack()" ng-if="currentPage.page_type != 'base_page'">
                    <i class="fas fa-arrow-left arrow"></i>{{currentPage.parentPageObject.name}}
                </div>
            </div>
            <div ng-if="currentPage.page_type != 'final_page'" id="gg-page-info" class="regular-page-information">
                <h2 class="title" ng-if="currentPage.name">{{currentPage.name}}</h2>
                <img class="image" ng-if="currentPage.image" src="{{currentPage.image}}"/>
                <p class="description" ng-if="currentPage.description">{{currentPage.description}}</p>
            </div>
            <!-- BUTTONS -->
            <div ng-if="currentPage.page_type != 'final_page'">
                <!-- If there are buttons -->
                <div ng-if="currentButtons.length > 0">
                    <!-- NO IMAGE BUTTONS -->
                    <div class="products-buttons" ng-if="currentPage.buttons_type == 'no_image'">
                    	<a ng-repeat="page in currentButtons | orderBy : 'position'" class="golden-button"  ng-click="changeToPage(page)">
                    		<span class="golden-button-text">{{page.name}}</span>
                    	</a>
                    </div>
                    <!-- SIDE IMAGE BUTTONS -->
                    <div class="products-buttons" ng-if="currentPage.buttons_type == 'side_image'">
                        <a ng-repeat="page in currentButtons | orderBy : 'position'" class="golden-button image-golden-button" ng-click="changeToPage(page)">
                            <span class="golden-button-text">{{page.name}}</span>
                            <div class="golden-button-image-container">
                                <img src="{{page.image}}"/>
                            </div>
                        </a>
                    </div>
                    <!-- HUGE IMAGE BUTTONS -->
                    <div class="products-buttons" ng-if="currentPage.buttons_type == 'huge_image'">
                        <a ng-repeat="page in currentButtons | orderBy : 'position'" class="golden-button-centered-image" ng-click="changeToPage(page)">
                            <div class="golden-button-image-container">
                                <img src="{{page.image}}">
                            </div>
                            <div class="golden-button image-golden-button">
                                <span class="golden-button-text">{{page.name}}</span>
                            </div>
                        </a>
                    </div>
                </div>
                <!-- No buttons - section under construction -->
                <div ng-if="currentButtons.length == 0" class="gg-page-under-contruction">
                    <img src="<?php echo $img_dir; ?>/logo-1.png"/>
                    <h1>Sección en construcción</h1>
                </div>
            </div>
            <!-- PRODUCTS -->
            <div ng-if="currentPage.page_type == 'final_page'">
                <div  id="gg-page-info" class="final-page-information">
                    <h2 class="title" ng-if="currentPage.name">{{currentPage.name}}</h2>
                    <img class="image" ng-if="currentPage.image" src="{{currentPage.image}}"/>
                    <p class="description" ng-if="currentPage.description">{{currentPage.description}}</p>
                </div>
                <div ng-if="currentProducts.length > 0" id="page-products" class="row">
                    <div ng-repeat="product in currentProducts | orderBy : 'position'" class="four columns single-product product-column">
                        <img class="product-image" src="{{product.image}}"/>
                        <p class="contenido-prod" style="text-align: center;">{{product.description}}</p>
                    </div>
                </div>
                <!-- No products - section under construction -->
                <div ng-if="currentProducts.length == 0" class="gg-page-under-contruction">
                    <img src="<?php echo $img_dir; ?>/logo-1.png"/>
                    <h1>Sección en construcción</h1>
                </div>
            </div>
        </div>
    </div>
<?php
    else:
        return $content;
    endif;
});


?>
