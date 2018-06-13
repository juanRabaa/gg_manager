panelProductos.factory('statusManager', function() {
    var statusManager = {
        savingToDB: false,
        checkingErrors: false,
        loading: false,
    };
console.log(statusManager);
    return statusManager;
});

panelProductos.factory('httpStatus', ['statusManager', '$timeout', function(statusManager, $timeout){
    var httpStatus = {
        postQueue: [],
        getQueue: [],
        pushPost: function(config){
            config.requestIDNumber = this.postQueue.length;
            this.postQueue.push(config);
        },
        pushGet: function(config){
            config.requestIDNumber = this.getQueue.length;
            this.getQueue.push(config);
        },
        removeRequest: function(config){
            if ( config.hasOwnProperty('requestIDNumber') ){
                if( this.configIsGET(config) )
                    findAndRemove( this.getQueue, req => req.requestIDNumber == config.requestIDNumber );
                else if( this.configIsPOST(config) )
                    findAndRemove( this.postQueue, req => req.requestIDNumber == config.requestIDNumber );
            }
        },
        insertRequest: function(config){
            if( this.configIsGET(config) )
                this.pushGet(config);
            if( this.configIsPOST(config) )
                this.pushPost(config);
        },
        urlIsGGRest: function( url ){
            return RegExp("gg/v\\d+").test(url);
        },
        configIsGET: function( config ){
            return config.method == "GET";
        },
        configIsPOST: function( config ){
            return config.method == "POST";
        },
        savingDone: function(){
            return this.postQueue.length == 0;
        },
        manageNewRequest: function( request ){
            if( this.urlIsGGRest(request.url) ){
                this.insertRequest(request);
                if(this.configIsPOST(request))
                    statusManager.savingToDB = true;
            }
            //console.log(request);
            return request;
        },
        manageRequestError: function( rejection ){
            if( this.urlIsGGRest(request.url) ){
                this.insertRequest(request);
                if(this.configIsPOST(request))
                    statusManager.savingToDB = true;
            }
            //console.log(request);
            return request;
        },
        manageNewResponse: function( reponse ){
            var config = reponse.config;
            if( this.urlIsGGRest(config.url) ){
                this.removeRequest(config);
                if( this.configIsPOST(config) && this.savingDone() )
                    statusManager.savingToDB = false;
            }
            return reponse;
        },
    };
    //console.log(httpStatus);
    return httpStatus;
}]);


panelProductos.factory('statusManagerHttpInterceptor', ['$q', 'httpStatus', function($q, httpStatus) {
  return {
    // optional method
    'request': function(config) {
        httpStatus.manageNewRequest(config);
      return config;
    },

    // optional method
   'requestError': function(rejection) {
      // do something on error
      // if (canRecover(rejection)) {
      //   return responseOrNewPromise
      // }
      return $q.reject(rejection);
    },



    // optional method
    'response': function(response) {
        httpStatus.manageNewResponse(response);
        return response;
    },

    // optional method
   'responseError': function(rejection) {
      // do something on error
      // if (canRecover(rejection)) {
      //   return responseOrNewPromise
      // }
      return $q.reject(rejection);
    }
  };
}]);


panelProductos.config(function ($httpProvider) {
  $httpProvider.interceptors.push('statusManagerHttpInterceptor');
});
