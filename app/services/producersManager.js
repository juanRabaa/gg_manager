panelProductos.factory('producersManager', ['$http', '$q', 'errorsManager', function($http, $q, errorsManager) {
    var producersManager = {
        producers: [],
        error: false,
        loading: true,
        updateProducers: function(){
            this.loading = true;
            var _this = this;
            var promise = $http.get(templateUrl + '/wp-json/gg/v1/producers/get/all');
            promise.then(function(result){
                console.log(result);
                _this.producers = result.data;
                _this.loading = false;
            }).catch(function(e){
                errorsManager.errorOcurred = {
                    description: "No se pudieron cargar los fabricantes",
                    reason: "Mensaje: " + e.data.message,
                };
                _this.error = e;
            });
            return promise;
        },
        getProducerByID: function( producerID, callback ){
            var wantedProducer = null;
            var index;

            this.producers.find(function( producer, idx ){
                if ( producer.ID == producerID ){
                    index = idx;
                    wantedProducer = producer;
                    return true;
                }
                return false;
            });

            if( callback )
                callback( wantedProducer, index, this.producers );

            return wantedProducer;
        },
        addProducer: function( producer ){
            var _this = this;
            var promise = $http.post(templateUrl + '/wp-json/gg/v1/producers/add', producer);
            promise.then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    _this.producers.push(producer);
                    Materialize.toast(producer.name + " agregado!", 5000);
                }
                else
                    Materialize.toast("Error al agregar fabricante: " + result.data.last_error, 10000);
                console.log(result);
            });
            console.log(producer);
            return promise;
        },
        removeProducer: function( producerID ){
            var producersFactory = this;
            var deletedProd = {};
            var promise = $http.post(templateUrl + '/wp-json/gg/v1/producers/delete', {ID: producerID});
            promise.then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    producersFactory.getProducerByID( producerID, function( wantedProducer, index ){
                        deletedProd = wantedProducer;
                        producersFactory.producers.splice(index, 1);
                    });
                    Materialize.toast(deletedProd.name + " eliminado!", 5000);
                }
                else
                    Materialize.toast("Error al eliminar fabricante: " + result.data.last_error, 10000);
                console.log(result);
            });
            return promise;
        },
        editProducer: function( newProducerData ){
            var _this = this;
            console.log("New Data: ", newProducerData);
            var promise = $http.post(templateUrl + '/wp-json/gg/v1/producers/edit', newProducerData);
            promise.then(function(result){
                var error = result.data.last_error;
                if ( error == "" ){
                    _this.getProducerByID( newProducerData.ID, function( oldProducer, index, array ){
                        Object.assign(oldProducer, newProducerData);
                    });
                    Materialize.toast(newProducerData.name + " editado correctamente!", 5000);
                }
                else
                    Materialize.toast("Error al editar fabricante: " + result.data.last_error, 10000);
                console.log(result);
            });
            return promise;
        },
    };

    producersManager.updateProducers();
    return producersManager;
}]);
