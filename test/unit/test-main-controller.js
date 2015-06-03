var expect = chai.expect;
describe('Main Controller', function () {
    beforeEach( module( 'tabData' ) );

    describe( 'MainCtrl' , function () {
        var ctrl, scope, controller, _navService;
        beforeEach(   inject( function ( $rootScope, $controller ) {
            scope = $rootScope.$new();
            controller = $controller;
            ctrl = controller( "MainCtrl", {$scope : scope } );
            expect(ctrl).to.not.be.undefined;
        }) );
        it ('should create empty $scope.collection', function() {
            scope.collection.should.be.an('array');
        });
        it ('should create empty model', function() {
            scope.model.should.be.an('object');
        });
        it ('should create addModel method' , function () {
            scope.addModel.should.be.a('function');
        });
        it ('should append the model to the collection and reset' , function() {
            expect ( scope.collection ).to.have.length(0);
            scope.model= { name: 'paul', sex: 'male'};
            scope.addModel();
            expect ( scope.collection ).to.have.length(1);
            expect ( scope.model ).to.deep.equal({});
        });
 });

});