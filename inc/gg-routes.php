<?php
RB_WP_Rest_API_Extended::get('gg/v1', '/products/get/all', array( 'GG_Database_Manager', 'get_products' ));
RB_WP_Rest_API_Extended::get('gg/v1', '/products/get/id/(?P<id>[a-zA-Z0-9-]+)', array( 'GG_Database_Manager', 'get_product_by_ID' ));

RB_WP_Rest_API_Extended::get('gg/v1', '/pages/get/all', array( 'GG_Database_Manager', 'get_pages' ));
RB_WP_Rest_API_Extended::get('gg/v1', '/pages/get/base_page', array( 'GG_Database_Manager', 'get_base_page' ));

RB_WP_Rest_API_Extended::authentication_group( function(){
    RB_WP_Rest_API_Extended::post('gg/v1', '/fpages/add_product', array( 'GG_Database_Manager', 'add_product_to_page' ));
    RB_WP_Rest_API_Extended::post('gg/v1', '/products/add', array( 'GG_Database_Manager', 'add_product' ));
    RB_WP_Rest_API_Extended::post('gg/v1', '/products/delete', array( 'GG_Database_Manager', 'delete_product' ));
    RB_WP_Rest_API_Extended::post('gg/v1', '/products/edit', array( 'GG_Database_Manager', 'edit_product' ));

    RB_WP_Rest_API_Extended::post('gg/v1', '/pages/add', array( 'GG_Database_Manager', 'add_page' ));
});


?>