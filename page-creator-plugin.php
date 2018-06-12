<?php
require 'inc/rb-wp-rest-api/rb-wp-rest-api.php';
require 'inc/gg-database-manager.php';
require 'inc/gg-routes.php';

/** Step 2 (from text above). */
add_action( 'admin_menu', 'my_plugin_menu' );

/** Step 1. */
function my_plugin_menu() {
	add_menu_page( 'My Plugin Options', 'Productos', 'manage_categories', 'products-panel', 'my_plugin_options', get_template_directory_uri().'/assets/img/galagourmet.png');
}

/** Step 3. */
function my_plugin_options() {
	if ( !current_user_can( 'manage_categories' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}

	wp_enqueue_media();

	// =============================================================================
	// STYLES
	// =============================================================================
    wp_enqueue_style( "skeleton-css", get_template_directory_uri()."/css/libs/Skeleton-2.0.4/css/skeleton.css", array() );
	wp_enqueue_style( "font-awesome-509",	"https://use.fontawesome.com/releases/v5.0.10/css/all.css", array() );
	wp_enqueue_style( "materialize-css", "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/css/materialize.min.css", array() );
	wp_enqueue_style( "materialize-icons", "https://fonts.googleapis.com/icon?family=Material+Icons", array() );

	wp_enqueue_style( "page-creator-css", get_template_directory_uri()."/page-creator/css/main.css", array() );
	// =============================================================================
	// SCRIPTS
	// =============================================================================
	wp_enqueue_script( "jquery", "https://code.jquery.com/jquery-3.1.1.min.js", true );
    wp_enqueue_script( "jquery-ui", "https://code.jquery.com/ui/1.10.3/jquery-ui.js", array("jquery"), true );
	wp_enqueue_script( "materialize-js", "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.1/js/materialize.min.js", array("jquery"), true );
    wp_enqueue_script( 'angularJS', "https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js", array("jquery"), true );
	wp_localize_script( 'angularJS', 'wordpressData', array(
	    'themeUrl'            => get_template_directory_uri(),
		'pageCreatorUrl'	  => get_template_directory_uri() . '/page-creator',
        'nonce' => wp_create_nonce( 'wp_rest' )
	) );
    wp_enqueue_script( 'angular-route', 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.9/angular-route.min.js', true );
	wp_enqueue_script( 'angular-materialize', 'https://cdnjs.cloudflare.com/ajax/libs/angular-materialize/0.2.2/angular-materialize.min.js', true );
	wp_enqueue_script( 'angular-ui-sortable', get_template_directory_uri()."/page-creator/app/bower_components/angular-ui-sortable/sortable.min.js", true );
	wp_enqueue_script( "angular-autocomplete-alt", get_template_directory_uri()."/page-creator/app/bower_components/angucomplete-alt/dist/angucomplete-alt.min.js", true );
    wp_enqueue_script( "angular-animate", get_template_directory_uri()."/page-creator/app/bower_components/angular-animate/angular-animate.min.js", true );
    // =============================================================================
    // APP
    // =============================================================================
	wp_enqueue_script( 'panel-productos-app', get_template_directory_uri()."/page-creator/app/app.js", true );
    // =============================================================================
    // DIRECTIVES
    // =============================================================================
    wp_enqueue_script( 'rb-wp-gallery-directive', get_template_directory_uri()."/page-creator/app/directives/rb-wp-gallery/rbWpGallery.js", true );
    // =========================================================================
    // SERVICES
    // =========================================================================
	wp_enqueue_script( 'gg-status-manager', get_template_directory_uri()."/page-creator/app/services/statusManager.js", true );
	wp_enqueue_script( 'gg-errors-managment', get_template_directory_uri()."/page-creator/app/services/errorsManager.js", true );
    wp_enqueue_script( 'gg-pages-factory', get_template_directory_uri()."/page-creator/app/services/pagesFactory.js", true );
    wp_enqueue_script( 'gg-products-factory', get_template_directory_uri()."/page-creator/app/services/productsFactory.js", true );
    wp_enqueue_script( 'gg-tabs-managment', get_template_directory_uri()."/page-creator/app/services/tabsManagment.js", true );
    // ============================================================================
    // CONTROLLERS
    // ============================================================================
    wp_enqueue_script( "generalController", get_template_directory_uri()."/page-creator/app/controllers/generalController.js", true );
	wp_enqueue_script( "initialController", get_template_directory_uri()."/page-creator/app/controllers/initialController.js", true );
	wp_enqueue_script( "productsManagmentController", get_template_directory_uri()."/page-creator/app/controllers/productsManagment.js", true );
	//Angular bootstrap
	wp_enqueue_script( "angular-bootstrap", get_template_directory_uri()."/page-creator/app/js/angular-bootstrap.js", true );
	//include( get_template_directory_uri().'/page-creator/page-creator.php' );

    get_template_part('page-creator/page', 'creator');
}

?>
