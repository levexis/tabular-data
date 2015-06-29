angular.module('tabData')
    .controller('MainCtrl' , function ( $scope , $rootScope) {
        $scope.model = {};
//        $scope.collection = [ { name: 'Paul', kids: 2, dob: new Date ( 1972,3,23), email: 'levexis@gmail.com'}, { name: 'Nelleke', kids: 12, dob: new Date ( 1973,4,29), email: 'nelleke_kloet@hotmail.com'}];
        $scope.collection = [];
        $scope.addModel = function () {
            $scope.collection.push( $scope.model );
            // create a new model
            $scope.model = {};
        };
    });
