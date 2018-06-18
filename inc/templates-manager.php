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


// =============================================================================
// Content filter
// =============================================================================
/*This part manages what happens when a page has the "products page" meta-box $checked.
It will replace the content of the page with the buttons and products from the administrator*/

function is_products_page($post_id){
    return get_post_meta( $post_id, 'gg_products_page_activated', true );
}

if (!is_admin()) {
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

add_filter('the_content', function( $content ){
    $post_id = get_the_ID();
    if ( is_products_page($post_id) ):
?>
    <div class="products-buttons" ng-app="ggPagesNavigation" ng-controller="pagesNavigation">
    	<a ng-repeat="page in currentButtons" class="golden-button"  ng-click="changeToPage(page)">
    		<span class="golden-button-text">{{page.name}}</span>
    	</a>
    </div>
<?php
    else:
        return $content;
    endif;
});


?>
