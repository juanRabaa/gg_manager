panelProductos.factory('pagesFactory', function($http) {
    var pagesFactory = {
        pages: [],
        loading: true,
        updatePages: function(){
            this.loading = true;
            var _this = this;
            $http.get(templateUrl + '/wp-json/gg/v1/pages/get/all').then(function(result){
                _this.pages = result.data;
                _this.loading = false;
                console.log(_this);
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
        getPageByID: function( pageID, callback ){
            var wantedPage = null;
            var index;

            this.pages.find(function( page, idx ){
                if ( page.ID == pageID ){
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
        editPage: function( newPageData ){
            var _this = this;
            console.log("New Data: ", newPageData);
            $http.post(templateUrl + '/wp-json/gg/v1/pages/edit', newPageData)
            .then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    _this.getPageByID( newPageData.ID, function( oldPage, index, array ){
                        Object.assign(oldPage, newPageData);
                    });
                    Materialize.toast(newPageData.name + " editado correctamente!", 5000);
                }
                else
                    Materialize.toast("Error al editar pagina: " + result.data.last_error, 10000);
                console.log(result);
            });
        },
        addPage: function( page ){
            var _this = this;
            $http.post(templateUrl + '/wp-json/gg/v1/pages/add', page).then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    _this.pages.push(page);
                    Materialize.toast(page.name + " agregada!", 5000);
                }
                else
                    Materialize.toast("Error al agregar la pagina: " + result.data.last_error, 10000);
                console.log(result);
            });
        },
        removePage: function( page ){
            var pagesFactory = this;
            $http.post(templateUrl + '/wp-json/gg/v1/pages/delete', page).then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    pagesFactory.getPageByID( page.ID, function( wantedPage, index ){
                        pagesFactory.pages.splice(index, 1);
                    });
                    Materialize.toast(page.name + " eliminado!", 5000);
                }
                else
                    Materialize.toast("Error al eliminar la pagina: " + result.data.last_error, 10000);
                console.log(result);
            });
        },
    };

    pagesFactory.updatePages();
    return pagesFactory;
});
