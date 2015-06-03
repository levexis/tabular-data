
angular.module('tabData',[])
    .config(['$compileProvider', function ($compileProvider) {
    // set false for production - exposes isolate scopes for test
        $compileProvider.debugInfoEnabled(true);
    }])
    .run(
    function ($rootScope, $window, $injector ) {
        var document = $window.document;
        // exposes some useful things for debugging and testing, should be removed in web app production
        $window.debug = {
            rootScope : $rootScope,
            injector : $injector,
            getService : function ( what ) {
                return $injector.get( what );
            }
        };
    });

