panelProductos.factory('pagesFactory', ['$http', '$q', 'errorsManager', 'wordpressPagesManager', function($http, $q, errorsManager, wordpressPagesManager) {
    var pagesFactory = {
        pages: [],
        pagesNotRelatedWithWpPages: [],
        error: false,
        loading: true,
        basePage: {},
        updatePages: function(){
            this.loading = true;
            var _this = this;
            $http.get(templateUrl + '/wp-json/gg/v1/pages/get/all').then(function(result){
                console.log(result);
                _this.pages = result.data;
                _this.basePage = _this.pages.find( page => page.page_type == "base_page" );
                if(_this.basePage ){
                    function findChildsRecursively( currentPage ){
                        currentPage.wpPage = wordpressPagesManager.getPage(currentPage.wp_page_ID);
                        currentPage.childPagesObj = _this.pages.filter( function(page, index){
                            if( page.parent_ID == currentPage.ID ){//Si es hijo de esta pagina
                                page.parentPageObject = currentPage;
                                findChildsRecursively( page );
                                return true;
                            }
                            return false;
                        });
                        if(!currentPage.wpPage)//Si no esta relacionado con una pagina de wordpress
                            _this.pagesNotRelatedWithWpPages.push(currentPage);
                    }
                    findChildsRecursively( _this.basePage );
                }
                else
                    console.log("There is not a Base Page");
                _this.loading = false;
            }).catch(function(e){
                console.log(e);
                errorsManager.errorOcurred = {
                    description: "No se pudieron cargar las paginas",
                    reason: "Mensaje: " + e.data.message,
                };
                _this.error = e;
            });
        },
        isDescendant: function(descendant, ancestor){
            if ( !descendant.parentPageObject )//No tiene padre...
                return false;
            if ( (descendant.parentPageObject.ID == ancestor.ID)
            || this.isDescendant(descendant.parentPageObject, ancestor) )//Es el padre, o el padre es hijo
                return true;
            return false; //default;
        },
        removePageFromLosts: function(page, removeChilds){
            this.pagesNotRelatedWithWpPages.forEach(function(elem, index, pages){
                if(elem.ID == page.ID || ( removeChilds && elem.parent_ID == page.ID))
                    pages.splice(index, 1);
            });
        },
        getPageChilds: function( page ){
            if ( page.hasOwnProperty('childPagesObj') )
                return page.childPagesObj;
            return [];
        },
        isNotRelated: function(page){
            if(page)
                return this.pagesNotRelatedWithWpPages.some(currPage => currPage.ID == page.ID );
            return false;
        },
        isNotRelatedChild: function(page){
            if(page)
                return this.pagesNotRelatedWithWpPages.some(currPage => currPage.ID == page.parent_ID );
            return false;
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
                data: sanitizeJSONforHttp(newPageData),
                savingNiceInfo: newPageData.name,
            };
            var promise = $http.post(config.url, config.data, config);
            promise.then(function(result){
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
            return promise;
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
                    pagesFactory.removePageFromLosts(page,true);
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


    var loadingInterval = setInterval(function(){
        console.log("Waiting for wordpress pages manager");
        if ( !wordpressPagesManager.loading ){
            console.log("DONE!");
            pagesFactory.updatePages();
            clearInterval(loadingInterval);
        }
    }, 100);

    return pagesFactory;
}]);
