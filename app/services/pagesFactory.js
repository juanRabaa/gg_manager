panelProductos.factory('pagesFactory', ['$http', '$q', 'errorsManager', function($http, $q, errorsManager) {
    var pagesFactory = {
        pages: [],
        error: false,
        loading: true,
        basePage: {},
        pagesTree: function(){
            var pages = this.pages.slice();
            var basePage = this.getBasePage();
            var pagesTree = [basePage];

            function findChildsRecursively( firstPage ){
                firstPage.childPagesObj = pages.filter( function(page, index){
                    if( page.parent_ID == firstPage.ID ){//Si es hijo de esta pagina
                        console.log("CHILD");
                        //pages.splice(index,1);//lo removemos del array
                        findChildsRecursively( page );
                        return true;
                    }
                    return false;
                });
            }
            console.log(basePage);
            findChildsRecursively( basePage );
            console.log(pagesTree);
            return pagesTree;
        },
        updatePages: function(){
            this.loading = true;
            var _this = this;
            $http.get(templateUrl + '/wp-json/gg/v1/pages/get/all').then(function(result){
                _this.pages = result.data;
                _this.basePage = _this.pages.find( page => page.page_type == "base_page" );
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
                _this.loading = false;
            }).catch(function(e){
                errorsManager.errorOcurred = {
                    description: "No se pudieron cargar las paginas",
                    reason: "Mensaje: " + e.data.message,
                };
                _this.error = e;
            });
        },
        getPageChilds: function( page ){
            if ( page.hasOwnProperty('childPagesObj') )
                return page.childPagesObj;
            return [];
        },
        getPageBy: function( field, value, callback ){
            var wantedPage = null;
            var index;
            var parentPage = {};
            var lastParent = {};

            function searchRecursively( firstPage, idx ){
                var recRes;
                if( firstPage.pageType != "final_page" ){
                    if ( firstPage[field] == value ){
                        index = idx;
                        wantedPage = firstPage;
                        parentPage = lastParent;
                        return true;
                    }
                    else{
                        if ( firstPage.childPagesObj ){//Si tiene hijos
                            recRes = firstPage.childPagesObj.some(function( page, idx ){//Si esta en alguno de sus hijos
                                lastParent = firstPage;
                                return searchRecursively( page, idx );
                            });
                        }
                        return false;
                    }
                }
                else
                    return false;
            }

            searchRecursively(this.basePage, 0);

            if( callback )
                callback( wantedPage, index, parentPage.childPagesObj, parentPage );

            return wantedPage;
        },
        getPageByID: function( pageID, callback ){
            return this.getPageBy( "ID", pageID, callback );
        },
        getBasePage: function( callback ){
            return this.basePage;
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
        addChild: function(parentID, child){
            this.getPageByID(parentID).childPagesObj.push(child);
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
                    _this.addChild(page.parent_ID, page);
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
            var promise = $http.post(templateUrl + '/wp-json/gg/v1/pages/delete', page);
            promise.then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    pagesFactory.getPageByID( page.ID, function( wantedPage, index, pagesArr, parentPage ){
                        if ( wantedPage ){
                            console.log("About to remove : ", wantedPage.name, "And all its childs");
                            console.log("Parent page: ", parentPage.ID);
                            var childPromises = [];
                            //Remove all the child pages from this page
                            //Should make this an optional step. If we dont want to eliminate them,
                            //We can send them to another db table
                            pagesFactory.getPageChilds(wantedPage).forEach(function(page){
                                console.log("Pushing remove promise for: ", page.name);
                                childPromises.push(pagesFactory.removePage(page));
                            });
                            $q.all(childPromises).then(function(){
                                console.log("All child removed --> Proceeding to remove page from array: ", wantedPage.name);
                                pagesArr.splice(index, 1);
                                Materialize.toast(page.name + " eliminado!", 5000);
                            });
                        }
                    });
                }
                else
                    Materialize.toast("Error al eliminar la pagina: " + result.data.last_error, 10000);
                callback(result);
            });
            return promise;
        },
    };

    pagesFactory.updatePages();
    return pagesFactory;
}]);
