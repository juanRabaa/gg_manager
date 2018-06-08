panelProductos.factory('errorsManager', function($http) {
    var errorsManager = {
        errorOcurred: false,
        checkForErrorsRunning: false,
        errorsInformation: {
            noSecurePage: {
                description: "La pagina no esta cargada en modo seguro",
                reason: "Debe usar el protocolo https para acceder al administrador",
                solutionText: "Cargar en forma segura",
                check: function(){
                    return location.protocol != 'https:';
                },
                solution: function(){
                    location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
                },
            },
        },
        checkForErrors: function(){
            this.checkForErrorsRunning = true;
            var result = false;
            for(var errorName in this.errorsInformation) {
                if( this.errorsInformation[errorName].check() ){
                    this.errorOcurred = this.errorsInformation[errorName];
                    result = this.errorsInformation[errorName];
                    break;
                }
            }
            this.checkForErrorsRunning = false;
            return result;
        },
    };
    return errorsManager;
});
