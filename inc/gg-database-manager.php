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
    const producers_table = (self::db_prefix) . 'producers';

	public static function wpdb_products_table(){
		return (self::wpdb_prefix()) . (self::products_table);
	}

    public static function wpdb_fpages_products_table(){
		return (self::wpdb_prefix()) . (self::fpages_products_table);
	}

    public static function wpdb_pages_table(){
		return (self::wpdb_prefix()) . (self::pages_table);
	}

    public static function wpdb_producers_table(){
		return (self::wpdb_prefix()) . (self::producers_table);
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
		return $wpdb->get_row('SELECT * FROM ' . self::wpdb_products_table() . ' WHERE ID = "' . $data['id'] . '"');
	}

    // =============================================================================
    // PAGES
    // =============================================================================

    public function get_pages(WP_REST_Request $request) {
		global $wpdb;
        $order_by = $request["order_by"] ? $request["order_by"] : "position";
		return $wpdb->get_results('SELECT * FROM ' . self::wpdb_pages_table() . ' ORDER BY ' . $order_by);
	}

    public function get_page_by_ID(WP_REST_Request $request) {
        global $wpdb;
        if ($request['ID'])
            return $wpdb->get_row('SELECT * FROM ' . self::wpdb_pages_table() . ' WHERE ID="'.$request['ID'].'" LIMIT 1');
        return null;
    }

    public function get_page_childs(WP_REST_Request $request) {
        global $wpdb;
        if ($request['ID'])
            return $wpdb->get_results('SELECT * FROM ' . self::wpdb_pages_table() . ' WHERE parent_ID="'.$request['ID'].'"');
        return null;
    }

    public function get_base_page(WP_REST_Request $request) {
		global $wpdb;
		return $wpdb->get_row('SELECT * FROM ' . self::wpdb_pages_table() . ' WHERE page_type="base_page" LIMIT 1');
	}

    public function get_first_order_page(WP_REST_Request $request){
        global $wpdb;
        $order_by = $request["order_by"] ? $request["order_by"] : "position";
		return $wpdb->get_results('SELECT * FROM ' . self::wpdb_pages_table() . ' WHERE parent_ID="A0" ORDER BY ' . $order_by);
    }

    public function add_page( WP_REST_Request $request ) {
		global $wpdb;
        $buttons_type = $request['page_type'] == 'final_page' ? "" : $request['buttons_type'];

		$page_data = array(
			'ID'   			 	=> $request['ID'],
			'name'    			=> $request['name'],
			'description'    	=> $request['description'],
			'buttons_type'    	=> $buttons_type,
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

    public function edit_page( WP_REST_Request $request ) {
		global $wpdb;
        $buttons_type = $request['page_type'] == 'final_page' ? "" : $request['buttons_type'];

		$page_data = array(
			'name'    			=> $request['name'],
			'description'    	=> $request['description'],
			'buttons_type'    	=> $buttons_type,
			'page_type'    		=> $request['page_type'],
			'image'	            => $request['image'],
			'visibility'    	=> $request['visibility'],
            'position'    		=> $request['position'],
            'parent_ID'    		=> $request['parent_ID'],
		);

		$wpdb->update(self::wpdb_pages_table(), $page_data, array('ID' => $request['ID']),
            array('%s','%s','%s','%s','%s','%d','%d','%s'),array( '%s' )
        );
		return $wpdb;
	}

    // =============================================================================
    // PAGES PRODUCTS
    // =============================================================================
    public function get_fpages_products( $data ) {
		global $wpdb;
		return $wpdb->get_results('SELECT * FROM ' . self::wpdb_fpages_products_table() . ' ORDER BY name');
	}

    public function get_fpage_products_by_parent_ID(WP_REST_Request $request) {
        global $wpdb;
        if ($request['pageID'])
            return $wpdb->get_row('SELECT * FROM ' . self::wpdb_fpages_products_table() . ' WHERE pageID="'.$request['pageID'].'"');
        return null;
    }

    public function add_product_to_page( WP_REST_Request $request ) {
        global $wpdb;
		$product_page_rel_data = array(
			'prodID'                 => $request['prodID'],
			'pageID'                 => $request['pageID'],
			'name'                   => $request['name'],
			'description'             => $request['description'],
			'image'                  => $request['image'],
			'use_prod_name'          => $request['use_prod_name'],
			'use_prod_description'   => $request['use_prod_description'],
            'use_prod_image'        => $request['use_prod_image'],
            'position'              => $request['position'],
		);

		$wpdb->insert(self::wpdb_fpages_products_table(), $product_page_rel_data, array('%s','%s','%s','%s','%s','%d','%d','%d','%d'));
		return $wpdb;
	}

    public function edit_fpage_product( WP_REST_Request $request ) {
        global $wpdb;
		$new_data = array(
			'name'                   => $request['name'],
			'description'             => $request['description'],
			'image'                  => $request['image'],
            'visibility'              => $request['visibility'],
			'use_prod_name'          => $request['use_prod_name'],
			'use_prod_description'   => $request['use_prod_description'],
            'use_prod_image'        => $request['use_prod_image'],
            'position'              => $request['position'],
		);
		$wpdb->update(self::wpdb_fpages_products_table(), $new_data, array('prodID' => $request['prodID'], 'pageID' => $request['pageID'] ),
        array('%s','%s','%s','%d','%d','%d','%d'));
		return $wpdb;
	}

    public function delete_fpage_product( WP_REST_Request $request ) {
        global $wpdb;
		$wpdb->delete(self::wpdb_fpages_products_table(), array('prodID' => $request['prodID'], 'pageID' => $request['pageID'] ));
		return $wpdb;
	}

    // =========================================================================
    // PRODUCTS
    // =========================================================================
    public function get_producers(WP_REST_Request $request) {
		global $wpdb;
		return $wpdb->get_results('SELECT * FROM ' . self::wpdb_producers_table() . ' ORDER BY name');
	}

    public function get_producer_by_ID(WP_REST_Request $request) {
        global $wpdb;
        if ($request['ID'])
            return $wpdb->get_row('SELECT * FROM ' . self::wpdb_producers_table() . ' WHERE ID="'.$request['ID'].'"');
        return null;
    }

	public function add_producer( WP_REST_Request $request ) {
		global $wpdb;
		$producer_data = array(
			'ID'   			 	=> $request['ID'],
			'name'    			=> $request['name'],
			'information'    	=> $request['information'],
			'logo'    	        => $request['logo'],
			'site'    			=> $request['site'],
		);

		$wpdb->insert(self::wpdb_producers_table(), $producer_data, array('%s','%s','%s','%s','%s'));
		return $wpdb;
	}

    public function edit_producer( WP_REST_Request $request ) {
        global $wpdb;
		$new_data = array(
            'name'    			=> $request['name'],
			'information'    	=> $request['information'],
			'logo'    	        => $request['logo'],
			'site'    			=> $request['site'],
		);
        $wpdb->update(self::wpdb_producers_table(), $new_data, array('ID' => $request['ID']), array('%s','%s','%s','%s'), array('%s'));
		return $wpdb;
	}

    public function delete_producer( WP_REST_Request $request ) {
        global $wpdb;
        if($request['ID'])
		      $wpdb->delete(self::wpdb_producers_table(), array('ID' => $request['ID']), array( '%s' ));
		return $wpdb;
	}


}

?>
