var chai = require( 'chai' ),
    chaiAsPromised = require( 'chai-as-promised' ),
    MainPage = require( './pages/main-page' ),
    Q = require( 'q' );

chai.use( chaiAsPromised );
var expect = chai.expect,
    should = chai.should();

describe( 'e2e', function () {
    describe( 'Page Objects', function () {
        var menu, main, deferred;
        beforeEach( function () {
            //fix to protractor phantomjs bug https://github.com/angular/protractor/issues/686
            //may now be superfluous
            browser.ignoreSynchronization = true;
            main = new MainPage();
            deferred = Q.defer();
            return main.get();
        } );
        afterEach( function () {
            browser.ignoreSynchronization = false;
            return takeScreenshot( 'test_' + new Date().getTime() );
        } );
        it( 'should display a blank form without a table', function () {
            return Q.all([
                expect( main.getHeading().getInnerHtml() ).to.eventually.equal( 'Tabular Data Example' ),
                expect( main.getTable().isDisplayed() ).to.eventually.be.false,
                expect( main.getAdd().isEnabled() ).to.eventually.be.false
            ]);
        } );
        it ( 'should be able to get the date boxes', function () {
            expect( main.getDay().getText() ).to.eventually.be.falsy;
        });

        describe( 'Stories', function () {
            var main, deferred, testPromise, journeys = {},j=0;
            beforeEach( function () {
                browser.ignoreSynchronization = true;
                main = new MainPage();
                deferred = Q.defer();
                testPromise = deferred.promise;
            } );
            journeys.completeForm = function (num) {
                if ( typeof num === 'number') {
                    j = num;
                } else {
                    j += 1;
                }
                return main.getName().sendKeys( 'name' + j ).then( function () {
                    return main.getEmail().sendKeys( 'email' + j + '@test.me').then( function () {
                        return main.getDay().sendKeys( j ).then( function () {
                            return main.getMonth().sendKeys( j ).then( function () {
                                return main.getYear().sendKeys( + j ).then( function () {
                                    return main.getKids().sendKeys( j );
                                } );
                            } );
                        } );
                    } );
                });
            };
            journeys.addModel = function ( num ) {
                return journeys.completeForm(num).then ( function () {
                    return main.getAdd().click()
                });
            };
            describe( 'main', function () {
                beforeEach( function () {
                    main.get();
                } );
                it( 'should invalidate blank fields', function () {
                    return Q.all([
                        expect(main.getName().getAttribute('class')).to.eventually.contain('ng-invalid'),
                        expect(main.getDay().getAttribute('class')).to.eventually.contain('ng-invalid' ),
                        expect(main.getMonth().getAttribute('class')).to.eventually.contain('ng-invalid' ),
                        expect(main.getYear().getAttribute('class')).to.eventually.contain('ng-invalid' ),
                        expect(main.getKids().getAttribute('class')).to.eventually.contain('ng-invalid' ),
                        expect(main.getEmail().getAttribute('class')).to.eventually.contain('ng-invalid')
                    ]);
                } );
                it( 'should validate correct email', function () {
                    var email = main.getEmail();
                    expect(email.sendKeys('test@test.com' ). then ( function () {
                        return email.getAttribute('class'); }) ).to.eventually.contain('ng-valid');
                } );
                it( 'should invalidate incorrect email', function () {
                    var email = main.getEmail();
                    expect(email.sendKeys('test@test' ). then ( function () {
                        return email.getAttribute('class'); }) ).to.eventually.contain('ng-valid');
                } );
                it( 'should require name', function () {
                    expect(main.getName().getAttribute('class')).to.eventually.contain('ng-invalid');
                } );
                it( 'should disable add by default', function () {
                    expect(main.getAdd().isEnabled() ).to.eventually.be.false;
                } );
                it( 'should enable add button when form validated', function () {
                    expect (journeys.completeForm().then ( function () {
                        return main.getAdd().isEnabled();} ) ).to.eventually.be.true;
                });
                it( 'should clear table once model added',function () {
                    expect (journeys.completeForm().then ( function () {
                        return main.getAdd().click().then( function() {
                            // check date as this is the most complicate use case
                            return main.getDay().getText()
                        } )
                    })).to.eventually.be.falsy;
                });
                it( 'should display table once collection started', function () {
                    expect (journeys.addModel().then ( function () {
                        return main.getTable().isDisplayed(); } ) ).to.eventually.be.true;
                });
                it( 'should change sorting when column clicked',function () {
                    expect( journeys.addModel().then( function () {
                        return main.getCol( 0 ).click().then( function () {
                            return main.getSortbox().getInnerHtml();
                        } )
                    } ) ).to.eventually.contain( 'name Descending' );
                });
                it( 'should allow table to be filtered using filter input',function () {
                    expect( journeys.addModel(10).then( function () {
                        return journeys.addModel(11).then( function () {
                            return main.getFilter().sendKeys('10' ).then ( function () {
                                return main.getRows();
                            });
                        });
                    }) ).to.eventually.have.length( 2 ); // rows will include the head row so expect 1 to be filtered
                });
                it( 'should sort alphabetically by default',function () {
                    expect( journeys.addModel(2).then( function () {
                        return journeys.addModel(1).then( function () {
                            return main.getCell(0,0).getInnerHtml();
                        });
                    }) ).to.eventually.equal('name1');
                });
            } );
        } );
    } );
});
