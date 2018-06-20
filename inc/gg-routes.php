<?php
// =============================================================================
// PRODUCTS ROUTES
// =============================================================================
RB_WP_Rest_API_Extended::get('gg/v1', '/products/get/all', array( 'GG_Database_Manager', 'get_products' ));
RB_WP_Rest_API_Extended::get('gg/v1', '/products/get/id/(?P<id>[a-zA-Z0-9-]+)', array( 'GG_Database_Manager', 'get_product_by_ID' ));

// =============================================================================
// PAGES ROUTES
// =============================================================================
// Gets all the pages
RB_WP_Rest_API_Extended::get('gg/v1', '/pages/get/all', array( 'GG_Database_Manager', 'get_pages' ));
RB_WP_Rest_API_Extended::get('gg/v1', '/pages/get/all/(?P<visibility>[a-zA-Z0-9-]+)', array( 'GG_Database_Manager', 'get_pages' ));
// Gets the base page
RB_WP_Rest_API_Extended::get('gg/v1', '/pages/get/base_page', array( 'GG_Database_Manager', 'get_base_page' ));
// Gets all the pages from the first page
RB_WP_Rest_API_Extended::get('gg/v1', '/pages/get/first_order', array( 'GG_Database_Manager', 'get_first_order_page' ));
RB_WP_Rest_API_Extended::get('gg/v1', '/pages/get/first_order/(?P<visibility>[a-zA-Z0-9-]+)', array( 'GG_Database_Manager', 'get_first_order_page' ));
// Gets a page by ID
RB_WP_Rest_API_Extended::get('gg/v1', '/pages/get/id/(?P<ID>[a-zA-Z0-9-]+)', array( 'GG_Database_Manager', 'get_page_by_ID' ));
// Gets a page childs pages
RB_WP_Rest_API_Extended::get('gg/v1', '/pages/get/childs/(?P<ID>[a-zA-Z0-9-]+)', array( 'GG_Database_Manager', 'get_page_childs' ));
RB_WP_Rest_API_Extended::get('gg/v1', '/pages/get/childs/(?P<ID>[a-zA-Z0-9-]+)/(?P<visibility>[a-zA-Z0-9-]+)', array( 'GG_Database_Manager', 'get_page_childs' ));

// =============================================================================
// PAGES PRODUCTS ROUTES
// =============================================================================
RB_WP_Rest_API_Extended::get('gg/v1', '/fpages/get/all', array( 'GG_Database_Manager', 'get_fpages_products' ));
RB_WP_Rest_API_Extended::get('gg/v1', '/fpages/get/parent/(?P<pageID>[a-zA-Z0-9-]+)', array( 'GG_Database_Manager', 'get_fpage_products_by_parent_ID' ));
RB_WP_Rest_API_Extended::get('gg/v1', '/fpages/get/parent/(?P<pageID>[a-zA-Z0-9-]+)/(?P<visibility>[a-zA-Z0-9-]+)', array( 'GG_Database_Manager', 'get_fpage_products_by_parent_ID' ));

// =============================================================================
// PRODUCERS ROUTES
// =============================================================================
RB_WP_Rest_API_Extended::get('gg/v1', '/producers/get/all', array( 'GG_Database_Manager', 'get_producers' ));

// =============================================================================
// ADMINISTRATOR ONLY ROUTES
// A estas rutas solo puede acceder un usuario logeado con rol de administrador
// =============================================================================
RB_WP_Rest_API_Extended::group(['role'   =>  'administrator'], function(){
    // =========================================================================
    // PRODUCTS ROUTES
    // =========================================================================
    RB_WP_Rest_API_Extended::post('gg/v1', '/products/add', array( 'GG_Database_Manager', 'add_product' ));
    RB_WP_Rest_API_Extended::post('gg/v1', '/products/delete', array( 'GG_Database_Manager', 'delete_product' ));
    RB_WP_Rest_API_Extended::post('gg/v1', '/products/edit', array( 'GG_Database_Manager', 'edit_product' ));

    // =============================================================================
    // PAGES ROUTES
    // =============================================================================
    RB_WP_Rest_API_Extended::post('gg/v1', '/pages/add', array( 'GG_Database_Manager', 'add_page' ));
    RB_WP_Rest_API_Extended::post('gg/v1', '/pages/edit', array( 'GG_Database_Manager', 'edit_page' ));
    RB_WP_Rest_API_Extended::post('gg/v1', '/pages/delete', array( 'GG_Database_Manager', 'delete_page' ));

    // =========================================================================
    // PAGES PRODUCTS ROUTES
    // =========================================================================
    RB_WP_Rest_API_Extended::post('gg/v1', '/fpages/add', array( 'GG_Database_Manager', 'add_product_to_page' ));
    RB_WP_Rest_API_Extended::post('gg/v1', '/fpages/edit', array( 'GG_Database_Manager', 'edit_fpage_product' ));
    RB_WP_Rest_API_Extended::post('gg/v1', '/fpages/delete', array( 'GG_Database_Manager', 'delete_fpage_product' ));

    // =============================================================================
    // PRODUCERS ROUTES
    // =============================================================================
    RB_WP_Rest_API_Extended::post('gg/v1', '/producers/add', array( 'GG_Database_Manager', 'add_producer' ));
    RB_WP_Rest_API_Extended::post('gg/v1', '/producers/edit', array( 'GG_Database_Manager', 'edit_producer' ));
    RB_WP_Rest_API_Extended::post('gg/v1', '/producers/delete', array( 'GG_Database_Manager', 'delete_producer' ));
});




?>
