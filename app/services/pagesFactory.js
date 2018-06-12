panelProductos.factory('pagesFactory', ['$http', 'errorsManager', function($http, errorsManager) {
    var pagesFactory = {
        pages: [],
        error: false,
        loading: true,
        pagesTree: function(){
            var pages = this.pages.slice();
            var basePage = this.getBasePage();
            var pagesTree = [basePage];

            function findChildsRecursively( firstPage ){
                console.log(pages);
                firstPage.childPagesObj = pages.filter( function(page, index){
                    console.log(page.ID, page.parent_ID);
                    if( page.parent_ID == firstPage.ID ){//Si es hijo de esta pagina
                        //pages.splice(index,1);//lo removemos del array
                        findChildsRecursively( page );
                        return true;
                    }
                    return false;
                });
            }

            findChildsRecursively( basePage );
            return pagesTree;
        },
        updatePages: function(){
            this.loading = true;
            var _this = this;
            $http.get(templateUrl + '/wp-json/gg/v1/pages/get/all').then(function(result){
                _this.pages = result.data;
                _this.loading = false;
                console.log(_this);
            }).catch(function(e){
                errorsManager.errorOcurred = {
                    description: "No se pudieron cargar las paginas",
                    reason: "Mensaje: " + e.data.message,
                };
                _this.error = e;
            });
        },
        getPageChilds: function( page ){
            var pages = [];
            if ( page.pageType != "final_page" ){
                console.log(this);
                pages = this.pages.filter(function( filtPage, idx ){
                    if ( filtPage.parent_ID == page.ID )
                        return true;
                    return false;
                });
            }
            return pages;
        },
        getPageBy: function( field, value, callback ){
            var wantedPage = null;
            var index;

            this.pages.find(function( page, idx ){
                if ( page[field] == value ){
                    index = idx;
                    wantedPage = page;
                    return true;
                }
                return false;
            });

            if( callback )
                callback( wantedPage, index, this.pages );

            return wantedPage;
        },
        getPageByID: function( pageID, callback ){
            return this.getPageBy( "ID", pageID, callback );
        },
        getBasePage: function( callback ){
            return this.getPageBy( "page_type", "base_page", callback );
        },
        editPage: function( newPageData, callback ){
            var _this = this;
            console.log("New Data: ", newPageData);
            var url = templateUrl + '/wp-json/gg/v1/pages/edit';
            var config = {
                url: url,
                data: newPageData,
                savingNiceInfo: newPageData.name,
            };
            $http.post(config.url, config.data, config).then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    _this.getPageByID( newPageData.ID, function( oldPage, index, array ){
                        Object.assign(oldPage, newPageData);
                    });
                    //Materialize.toast(newPageData.name + " editado correctamente!", 5000);
                }
                else
                    Materialize.toast("Error al editar pagina: " + result.data.last_error, 10000);
                if(callback)
                    callback(result);
                console.log(result);
            });
        },
        addPage: function( page, callback ){
            var _this = this;
            var url = templateUrl + '/wp-json/gg/v1/pages/add';
            var config = {
                url: url,
                data: page,
                savingNiceInfo: page.name,
            };
            $http.post(config.url,config.data,config).then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    _this.pages.push(page);
                    Materialize.toast(page.name + " agregada!", 5000);
                }
                else
                    Materialize.toast("Error al agregar la pagina: " + result.data.last_error, 10000);
                if(callback)
                    callback(result);
                console.log(result);
            });
        },
        removePage: function( page, callback){
            var pagesFactory = this;
            $http.post(templateUrl + '/wp-json/gg/v1/pages/delete', page).then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    pagesFactory.getPageByID( page.ID, function( wantedPage, index ){
                        pagesFactory.pages.splice(index, 1);
                        Materialize.toast(page.name + " eliminado!", 5000);
                    });
                }
                else
                    Materialize.toast("Error al eliminar la pagina: " + result.data.last_error, 10000);
                callback(result);
            });
        },
    };

    pagesFactory.updatePages();
    return pagesFactory;
}]);

panelProductos.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
});
