<?php
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
    const pages_table = (self::db_prefix) . 'pages';

	public static function wpdb_products_table(){
		return (self::wpdb_prefix()) . (self::products_table);
	}

    public static function wpdb_fpages_products_table(){
		return (self::wpdb_prefix()) . (self::fpages_products_table);
	}

    public static function wpdb_pages_table(){
		return (self::wpdb_prefix()) . (self::pages_table);
	}

	public static function wpdb_prefix(){
		global $wpdb;
		return $wpdb->prefix;
	}

	// =============================================================================
	// DB MANIPULATION
	// =============================================================================
    // =========================================================================
    // PRODUCTS
    // =========================================================================
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

    // =============================================================================
    // PAGES
    // =============================================================================

    public function get_pages( $data ) {
		global $wpdb;
		return $wpdb->get_results('SELECT * FROM ' . self::wpdb_pages_table() . ' ORDER BY name');
	}

    public function get_base_page( $data ) {
		global $wpdb;
		return $wpdb->get_results('SELECT * FROM ' . self::wpdb_pages_table() . ' WHERE page_type="base_page" LIMIT 1');
	}

    public function add_page( WP_REST_Request $request ) {
		global $wpdb;
		$page_data = array(
			'ID'   			 	=> $request['ID'],
			'name'    			=> $request['name'],
			'description'    	=> $request['description'],
			'buttons_type'    	=> $request['buttons_type'],
			'page_type'    		=> $request['page_type'],
			'image'	             => $request['image'],
			'visibility'    	=> 1,
            'position'    		=> $request['position'],
            'parent_ID'    		=> $request['parent_ID'],
		);

		$wpdb->insert(self::wpdb_pages_table(), $page_data, array('%s','%s','%s','%s','%s','%s','%d','%d','%s'));
		return $wpdb;
	}

    public function delete_page( WP_REST_Request $request ) {
        global $wpdb;
		$wpdb->delete(self::wpdb_pages_table(), array('ID' => $request['ID']), array( '%s' ));
		return $wpdb;
	}
}

?>
