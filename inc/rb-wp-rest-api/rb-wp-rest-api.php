<?php
class RB_WP_Rest_API_Extended{
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
            $current_data['args']['permission_callback'] = array('RB_WP_Rest_API_Extended', 'check_user_authentication');

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



?>
