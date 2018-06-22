panelProductos.factory('wordpressPagesManager', ['$http', '$q', 'errorsManager', function($http, $q, errorsManager) {
    var wordpressPagesManager = {
        pages: [],
        error: false,
        loading: true,
        updatePages: function(){
            this.loading = true;
            var _this = this;
            var promise = $http.get(templateUrl + '/wp-json/gg/v1/wp_pages/get/tree' );
            promise.then(function(result){
                if ( result.data )
                    _this.pages = result.data;
                console.log(result);
                _this.loading = false;
            }).catch(function(e){
                console.log(e);
                errorsManager.errorOcurred = {
                    description: "Error al cargar las WP_Pages",
                    reason: "Mensaje: " + e,
                };
                _this.error = e;
                _this.loading = false;
            });
            return promise;
        },
        getPage: function(wpPageID){
            var result = null;
            function findRecursively(pages, wpPageID){
                return pages.some(function(page){
                    if (page.id == wpPageID){//Si es esta pagina
                        result = page;
                        return true;
                    }
                    else if (page.child_pages){//Si tiene hijos
                        return findRecursively(page.child_pages, wpPageID);
                    }
                    return false;
                });
            }
            findRecursively(this.pages, wpPageID);
            return result;
        },
        editPage: function(wpPage){
            console.log(wpPage);
            this.loading = true;
            var _this = this;
            var promise = $http.post(templateUrl + '/wp-json/wp/v2/pages/' + wpPage.id, wpPage);
            promise.then(function(result){
                var oldPage = _this.getPage(wpPage.id);
                var newPage = result.data;
                for(var key in newPage){
                    oldPage[key] = newPage[key];
                }
                console.log(result);
                _this.loading = false;
            }).catch(function(e){
                console.log(e);
                errorsManager.errorOcurred = {
                    description: "Error al editar un WP_Page",
                    reason: "Mensaje: " + e.data.message,
                };
                _this.error = e;
            });
            return promise;
        },
        addPage: function(wpPage){
            if(wpPage.post_parent)
                this.getPage(wpPage.post_parent).child_pages.push(wpPage);
            else
                this.pages.push(wpPage);
        },
        createPage: function(wpPage){
            this.loading = true;
            var _this = this;
            var promise = $http.post(templateUrl + '/wp-json/wp/v2/pages', wpPage);
            promise.then(function(result){
                console.log(result);
                _this.addPage(result.data);
                _this.loading = false;
            }).catch(function(e){
                console.log(e);
                errorsManager.errorOcurred = {
                    description: "Error al agregar un WP_Page",
                    reason: "Mensaje: " + e.data.message,
                };
                _this.error = e;
            });
            return promise;
        },
    };

    wordpressPagesManager.updatePages();

    return wordpressPagesManager;
}]);
