var expect = chai.expect;
describe( 'directives', function () {
    var elm, scope, iscope;
    beforeEach( module( 'tabData' ) );
    describe( 'tdDate', function () {
        beforeEach( inject( function ( $rootScope, $compile ) {
            elm = angular.element( '<div><td-date ng-model="test.date"></td-date></div>' );
            scope = $rootScope.$new();
            scope.test = {};
            elm = $compile( elm )( scope );
            scope.$digest();
            iscope = elm.find( 'td-date' ).isolateScope();
        } ) );
        it( 'should return number inputs', function () {
            elm.html().should.contain( '<input' );
            elm.html().should.contain( 'type="number"' );
        } );
        describe( 'methods', function () {
            it( 'should have fullYear method', function () {
                expect( iscope.fullYear ).to.be.a( 'function' );
            } );
            it( 'should get a number back from fullYear', function () {
                expect( iscope.fullYear( 00 ) ).to.be.a( 'number' );
            } );
            it( 'should turn 00 to 2000', function () {
                expect( iscope.fullYear( 00 ) ).to.equal( 2000 );
            } );
            it( 'should not change numbers > 100', function () {
                expect( iscope.fullYear( 100 ) ).to.equal( 100 );
                expect( iscope.fullYear( 1000 ) ).to.equal( 1000 );
                expect( iscope.fullYear( 1910 ) ).to.equal( 1910 );
            } );
            it( 'should not change numbers > current year to 1900', function () {
                expect( iscope.fullYear( 50 ) ).to.equal( 1950 );
                expect( iscope.fullYear( new Date().getYear() + 1900 - 2000 ) ).to.equal( new Date().getYear() + 1900 );
                expect( iscope.fullYear( new Date().getYear() + 1900 - 2000 + 1 ) ).to.equal( new Date().getYear() + 1900 - 99 );
            } );
            it('should start with blank day,month,year',function () {
                expect( iscope.day).to.be.undefined;
                expect( iscope.month).to.be.undefined;
                expect( iscope.year).to.be.undefined;
            } );
            it('should reset day,month,year when model is reset',function () {
                iscope.day = iscope.month = iscope.year =1;
                iscope.updateModel();
                expect( scope.test.date).to.deep.equal( new Date (2001,0,1) ) ;
                scope.test.date=undefined;
                scope.$digest();
                expect( iscope.day).to.be.undefined;
                expect( iscope.month).to.be.undefined;
                expect( iscope.year).to.be.undefined;
            } );

            it('should set day,month,year if model set to a date');//todo: not implemented yet

        } );
    } );
    describe( 'tdTabulate', function () {
        var _compile
        beforeEach( inject( function ( $rootScope, $compile ) {
            _compile = $compile;
            elm = angular.element( '<div><td-tabulate collection="testdata" col0="test_col" col1="next_col"></td-tabulate></div>' );
            scope = $rootScope.$new();
            scope.testdata = [
                {test_col : 'one', next_col : 'two' } ,
                {test_col : 'three', next_col : 'four' }
            ];
            elm = $compile( elm )( scope );
            scope.$digest();
            iscope = elm.find( 'td-tabulate' ).isolateScope();
        } ) );
        it( 'should populate collection with testdata', function () {
            elm.html().should.contain( '<input' );
            expect( iscope.collection ).to.have.length( 2 );
        } );
        it( 'should have a filter box', function () {
            elm.html().should.contain( '<input' );
        } );
        it( 'should display 2 rows', function () {
            iscope.search = undefined;
            iscope.$digest();
            elm.html().should.contain( 'name="row0"' );
            elm.html().should.contain( 'name="row1"' );
            elm.html().should.contain( 'three' );
            elm.html().should.not.contain( 'name="row2"' );
        });
        it( 'should filter on search value',function () {
            iscope.search = 'one';
            iscope.$digest();
            elm.html().should.contain( 'name="row0"' );
            elm.html().should.not.contain( 'name="row1"' );
            elm.html().should.not.contain( 'three' );
        });
        it( 'should show order and direction',function () {
            var p = elm.find('p');
            p.html().should.contain( 'test_col Ascending' );
            iscope.clickCol(0);
            iscope.$digest();
            p.html().should.contain( 'test_col Descending' );
        });
        describe( 'methods', function () {
            it( 'should have clickCol method', function () {
                expect( iscope.clickCol ).to.be.a( 'function' );
            } );
            it( 'should sort by col0 ascending by defaults', function () {
                expect( iscope.sortName ).to.equal( 'test_col' );
                expect( iscope.desc ).to.be.false;
            } );
            it( 'should reverse sort order on clickCol', function () {
                iscope.clickCol( 0 );
                expect( iscope.desc ).to.be.true;
            } );
            it( 'should sort by new column descending', function () {
                iscope.clickCol( 1 );
                expect( iscope.sortName ).to.equal( 'next_col' );
                expect( iscope.desc ).to.be.true;
            } );
        } );
    } );
} );
describe( 'filters', function () {
    var filter,
        testData = [
            {name : 'test', value : 1} ,
            {name : 'test1', value : 2},
            { name : 'test2', value : 3}
        ];
    beforeEach( module( 'tabData' ) );
    describe( 'tdFilterValues', function () {
        beforeEach( function () {
            // how to run a module!
            module.apply( 'tabData' );
            inject( function ( $injector ) {
                filter = $injector.get( '$filter' )( 'tdFilterValues' );
            } );
        } );
        it( 'should return all values if no input', function () {
            expect( filter( testData ) ).to.deep.equal( testData );
        } );
        it( 'should only search text fields', function () {
            expect( filter( testData, 2 ) ).to.have.length( 1 );
            expect( filter( testData, '2' ) ).to.have.length( 1 );
        } );
        it( 'should return an empty array if no matches', function () {
            expect( filter( testData, 'x' ) ).to.have.length( 0 );
        } );
    } );
    describe( 'tdFormatCell', function () {
        beforeEach( function () {
            // how to run a module!
            module.apply( 'tabData' );
            inject( function ( $injector ) {
                filter = $injector.get( '$filter' )( 'tdFormatCell' );
            } );
        } );
        it( 'should not change a text field', function () {
            expect( filter( 'hello' ) ).to.equal( 'hello' );
        } );
        it( 'should not change a number field', function () {
            expect( filter( 3 ) ).to.equal( 3 );
        } );
        it( 'should format a date', function () {
            expect( filter( new Date( 2015, 05, 02 ) ) ).to.equal( '2/6/2015' );
        } );
    } );
} );


