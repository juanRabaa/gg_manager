<?php

class WP_Rest_API_Extended{
    // =============================================================================
    // SINGLETON CONFIGURATION
    // =============================================================================
	// Contenedor de la instancia del singleton
    private static $instancia;

    // Un constructor privado evita la creación de un nuevo objeto
    private function __construct() {}

    // método singleton
    public static function singleton(){
        if (!isset(self::$instancia)){
            $miclase = __CLASS__;
            self::$instancia = new $miclase;
        }
        return self::$instancia;
    }

	// Evita que el objeto se pueda clonar
    public function __clone(){
        trigger_error('La clonación de este objeto no está permitida', E_USER_ERROR);
    }

    // =============================================================================
    // BEGINS
    // =============================================================================
    //Bool, if set to true, all routes registered afterwards will need authentication
    private static $requires_authentication = false;

    //Checks if the user can edit posts, if not, throws a WP_Error
    public static function check_user_authentication(){
        if( current_user_can( 'edit_others_posts' ) )
            return true;
        return new WP_Error( 'rest_auth_error', __( 'You need to be an authorized user to use this endpoint' ),
            array( 'status' => rest_authorization_required_code() ) );
    }

    //Register the rest route, using the $data given
    private static function register_rest_route($data){
        register_rest_route( $data['namespace'], $data['route'], $data['args'] );
    }

    public static function register_route($methods, $namespace, $route, $callback){
        $current_data = array(
            'namespace' => $namespace,
            'route'     => $route,
            'args'      => array(
                'methods'   => $methods,
                'callback'  => $callback,
        ));

        if ( self::$requires_authentication )
            $current_data['args']['permission_callback'] = array('WP_Rest_API_Extended', 'check_user_authentication');

        add_action( 'rest_api_init', self::register_rest_route($current_data));
    }

    public static function get($namespace, $route, $callback){
        self::register_route("GET", $namespace, $route, $callback);
    }

    public static function post($namespace, $route, $callback){
        self::register_route("POST", $namespace, $route, $callback);
    }

    //$actions => function      Group all the routes in the function given and
    //                          makes them only available for authenticated users
    public static function authentication_group( $actions ){
        self::$requires_authentication = true;
        $actions();
        self::$requires_authentication = false;
    }
}

class GG_Database_Manager{
	// Contenedor de la instancia del singleton
    private static $instancia;

    // Un constructor privado evita la creación de un nuevo objeto
    private function __construct() {
    }

    // método singleton
    public static function singleton(){
        if (!isset(self::$instancia)){
            $miclase = __CLASS__;
            self::$instancia = new $miclase;
        }
        return self::$instancia;
    }

	// Evita que el objeto se pueda clonar
    public function __clone(){
        trigger_error('La clonación de este objeto no está permitida', E_USER_ERROR);
    }

	// =============================================================================
	// TABLE NAMES
	// =============================================================================
	const db_prefix = 'gg_';
	const products_table = (self::db_prefix) . 'products';
    const fpages_products_table = (self::db_prefix) . 'fpages_products';

	public static function wpdb_products_table(){
		return (self::wpdb_prefix()) . (self::products_table);
	}

    public static function wpdb_fpages_products_table(){
		return (self::wpdb_prefix()) . (self::fpages_products_table);
	}

	public static function wpdb_prefix(){
		global $wpdb;
		return $wpdb->prefix;
	}

	// =============================================================================
	// DB MANIPULATION
	// =============================================================================
	public function add_product( WP_REST_Request $request ) {
		global $wpdb;
		$product_data = array(
			'ID'   			 	=> $request['ID'],
			'name'    			=> $request['name'],
			'description'    	=> $request['description'],
			'price_pesos'    	=> $request['price_pesos'],
			'image'    			=> $request['image'],
			'parent_product_ID'	=> $request['parent_product_ID'] ? $request['parent_product_ID'] : NULL,
			'enabled'    		=> 1,
		);

		$wpdb->insert(self::wpdb_products_table(), $product_data, array('%s','%s','%s','%f','%s','%s','%d'));
		return $wpdb;
	}

    public function edit_product( WP_REST_Request $request ) {
		global $wpdb;
		$product_data = array(
			'name'    			=> $request['name'],
			'description'    	=> $request['description'],
			'price_pesos'    	=> $request['price_pesos'],
			'image'    			=> $request['image'],
			'parent_product_ID'	=> $request['parent_product_ID'] ? $request['parent_product_ID'] : NULL,
			'enabled'    		=> $request['enabled'],
		);

		$wpdb->update(self::wpdb_products_table(), $product_data, array('ID' => $request['ID']),
            array('%s','%s','%f','%s','%s','%d'),
            array( '%s' )
        );
		return $wpdb;
	}

    public function delete_product( WP_REST_Request $request ) {
		global $wpdb;
		$wpdb->delete(self::wpdb_products_table(), array('ID' => $request['ID']), array( '%s' ));
		return $wpdb;
	}

    public function disable_product( WP_REST_Request $request ) {
		global $wpdb;
		$product_data = array(
			'name'    			=> $request['name'],
			'description'    	=> $request['description'],
			'price_pesos'    	=> $request['price_pesos'],
			'image'    			=> $request['image'],
			'parent_product_ID'	=> $request['parent_product_ID'] ? $request['parent_product_ID'] : NULL,
			'enabled'    		=> $request['enabled'],
		);

		$wpdb->update(self::wpdb_products_table(), $product_data, array('ID' => $request['ID']),
            array('%s','%s','%f','%s','%s','%d'),
            array( '%s' )
        );
		return $wpdb;
	}

    public function get_products( $data ) {
		global $wpdb;
		return $wpdb->get_results('SELECT * FROM ' . self::wpdb_products_table() . ' ORDER BY name');
	}

    public function get_product_by_ID( $data ) {
		global $wpdb;
		return $wpdb->get_results('SELECT * FROM ' . self::wpdb_products_table() . ' WHERE ID = "' . $data['id'] . '"');
	}

    public function add_product_to_page( WP_REST_Request $request ) {
        global $wpdb;
		$product_page_rel_data = array(
			'prodID'                 => $request['prodID'],
			'pageID'                 => $request['pageID'],
			'name'                   => $request['name'],
			'decription'             => $request['decription'],
			'image'                  => $request['image'],
			'use_prod_name'          => $request['use_prod_name'],
			'use_prod_description'   => $request['use_prod_description'],
            'use_prod_image'        => $request['use_prod_image'],
            'position'              => $request['position'],
		);

		$wpdb->insert(self::wpdb_fpages_products_table(), $product_page_rel_data, array('%s','%s','%s','%s','%s','%d','%d','%d','%d'));
		return $wpdb;
	}
}

/** Step 2 (from text above). */
add_action( 'admin_menu', 'my_plugin_menu' );

/** Step 1. */
function my_plugin_menu() {
	add_menu_page( 'My Plugin Options', 'Productos', 'manage_options', 'products-panel', 'my_plugin_options', get_template_directory_uri().'/assets/img/galagourmet.png');
}

/** Step 3. */
function my_plugin_options() {
	if ( !current_user_can( 'manage_options' ) )  {
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
        'nonce' => wp_create_nonce( 'wp_rest' )
	) );
    wp_enqueue_script( 'angular-route', 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.9/angular-route.min.js', true );
	wp_enqueue_script( 'angular-materialize', 'https://cdnjs.cloudflare.com/ajax/libs/angular-materialize/0.2.2/angular-materialize.min.js', true );
	wp_enqueue_script( 'panel-productos-app', get_template_directory_uri()."/page-creator/app/app.js", true );
	wp_enqueue_script( 'angular-ui-sortable', get_template_directory_uri()."/page-creator/app/bower_components/angular-ui-sortable/sortable.min.js", true );
	wp_enqueue_script( "angular-autocomplete-alt", get_template_directory_uri()."/page-creator/app/bower_components/angucomplete-alt/dist/angucomplete-alt.min.js", true );
	//Controllers
	wp_enqueue_script( "initialController", get_template_directory_uri()."/page-creator/app/controllers/initialController.js", true );
	wp_enqueue_script( "productsManagmentController", get_template_directory_uri()."/page-creator/app/controllers/productsManagment.js", true );
	//Angular bootstrap
	wp_enqueue_script( "angular-bootstrap", get_template_directory_uri()."/page-creator/app/js/angular-bootstrap.js", true );
	//include( get_template_directory_uri().'/page-creator/page-creator.php' );



    get_template_part('page-creator/page', 'creator');
}

// =============================================================================
// REST API
// =============================================================================

function my_awesome_func( WP_REST_Request $request ) {
  // You can access parameters via direct array access on the object:
  $param = $request['some_param'];

  // Or via the helper method:
  $param = $request->get_param( 'some_param' );

  // You can get the combined, merged set of parameters:
  $parameters = $request->get_params();

  // The individual sets of parameters are also available, if needed:
  $parameters = $request->get_url_params();
  $parameters = $request->get_query_params();
  $parameters = $request->get_body_params();
  $parameters = $request->get_json_params();
  $parameters = $request->get_default_params();

  // Uploads aren't merged in, but can be accessed separately:
  $parameters = $request->get_file_params();

  return $request['name'];
}

function add_product( WP_REST_Request $request ) {
	global $wpdb;

	$wpdb->insert(
		$wpdb->prefix . $gg_db_prefix . 'products',
		array(
			'ID'   			 	=> $request['ID'],
			'name'    			=> $request['name'],
			'description'    	=> $request['description'],
			'price'    			=> $request['price'],
			'image'    			=> $request['image'],
			'parent_product_ID'	=> $request['parent_product_ID'],
			'enabled'    		=> 1,
		),
		array(
			'%s',
			'%s',
			'%s',
			'%f',
			'%s',
			'%s',
			'%d',
		)
	);
	return $wpdb;
}

add_action( 'rest_api_init', function () {
  register_rest_route( 'gg/v1', '/author', array(
    'methods' => 'POST',
    'callback' => 'my_awesome_func',
  ) );
});

// =============================================================================
// PRODUCTS
// =============================================================================

WP_Rest_API_Extended::get('gg/v1', '/products/get/all', array( 'GG_Database_Manager', 'get_products' ));
WP_Rest_API_Extended::get('gg/v1', '/products/get/id/(?P<id>[a-zA-Z0-9-]+)', array( 'GG_Database_Manager', 'get_product_by_ID' ));

WP_Rest_API_Extended::authentication_group( function(){
    WP_Rest_API_Extended::post('gg/v1', '/fpages/add_product', array( 'GG_Database_Manager', 'add_product_to_page' ));
    WP_Rest_API_Extended::post('gg/v1', '/products/add', array( 'GG_Database_Manager', 'add_product' ));
    WP_Rest_API_Extended::post('gg/v1', '/products/delete', array( 'GG_Database_Manager', 'delete_product' ));
    WP_Rest_API_Extended::post('gg/v1', '/products/edit', array( 'GG_Database_Manager', 'edit_product' ));
});
?>
