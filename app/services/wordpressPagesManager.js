panelProductos.factory('wordpressPagesManager', ['$http', '$q', 'errorsManager', function($http, $q, errorsManager) {
    var wordpressPagesManager = {
        pages: [],
        error: false,
        loading: true,
        updatePages: function(){
            this.loading = true;
            var _this = this;
            $http.get(templateUrl + '/wp-json/gg/v1/pages/get/all').then(function(result){
                _this.pages = result.data;
                _this.basePage = _this.pages.find( page => page.page_type == "base_page" );
                if(_this.basePage ){
                    function findChildsRecursively( firstPage ){
                        firstPage.childPagesObj = _this.pages.filter( function(page, index){
                            if( page.parent_ID == firstPage.ID ){//Si es hijo de esta pagina
                                console.log("CHILD");
                                //pages.splice(index,1);//lo removemos del array
                                findChildsRecursively( page );
                                return true;
                            }
                            return false;
                        });
                    }
                    findChildsRecursively( _this.basePage );
                }
                else
                    console.log("There is not a Base Page");
                _this.loading = false;
            }).catch(function(e){
                errorsManager.errorOcurred = {
                    description: "No se pudieron cargar las paginas",
                    reason: "Mensaje: " + e.data.message,
                };
                _this.error = e;
            });
        },
    };

    wordpressPagesManager.updatePages();
    return wordpressPagesManager;
}]);
