panelProductos.factory('tabsManagment', function() {
    var factory = {
        activatedTab: '',
        activateTab: function ( $rootScope, name ) {
            $rootScope.activatedTab = name;
            console.log(name);
        },
    }
    return factory;
});
