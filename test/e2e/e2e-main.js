var chai = require('chai' ),
    chaiAsPromised = require('chai-as-promised' ),
    MenuPage = require('./pages/menu-page' ),
    MainPage = require('./pages/main-page' ),
    HomePage = require('./pages/home-page' ),
    ContentPage = require('./pages/content-page' ),
    fs = require ('fs' ),
    ARTIFACT_DIR = process.env['ARTIFACT_DIR'] || process.env['CIRCLE_ARTIFACTS'],
    Q = require('q');

chai.use(chaiAsPromised);
var expect = chai.expect,
    should = chai.should();

// should we set the API url here? Maybe configure the factory?
logIt = function (message) {
    console.trace(message);
};
browser.driver.manage().window().setSize(800, 600);

// takes a screenshot, optional filename and next
// returns promise resolved on screenshot
function takeScreenshot (filename, next) {
    if ( ARTIFACT_DIR ) {
        filename = ARTIFACT_DIR + '/' + filename;
        var deferred = new Q.defer();
        browser.takeScreenshot().then( function ( img ) {
            console.log( 'see [' + filename + '] for screenshot' );
            fs.writeFileSync( filename, new Buffer( img, 'base64' ) );
            if ( typeof next === 'function' ) {
                next( 'filename' );
                // promise
            } else if ( typeof next === 'object' && typeof next.resolve === 'function' ) {
                next.resolve( filename );
            }
            deferred.resolve();
        } );
        return deferred.promise;
    }
}
// make the directory for screentshot if local, if ci remaking this will destroy link to artifacts
if ( process.env['ARTIFACT_DIR'] ) {
    try {
        fs.mkdirSync( ARTIFACT_DIR );
    } catch ( e ) {
        if ( e.code != 'EEXIST' ) throw e;
    }
}
describe('e2e', function () {
    describe ('Page Objects', function() {
        var menu,main,deferred;
        beforeEach( function () {
            // don't you just love opensource, fix to protractor phantomjs bug https://github.com/angular/protractor/issues/686
            browser.ignoreSynchronization = true;
            main = new MainPage();
            menu = new MenuPage();
            deferred = Q.defer();
            return main.get();
        } );
        afterEach( function () {
            browser.ignoreSynchronization = false;
            return takeScreenshot('test_' + new Date().getTime() );
        } );
        /*
        it( 'should create a valid menu', function () {
            menu.get();
            return Q.all([
                expect( menu.list.count() ).to.eventually.equal( 4 ),
                expect( menu.list.get( 0 ).getText() ).to.eventually.contain( 'Medit8' ),
                expect( menu.getHome().getText() ).to.eventually.contain( 'Medit8' ),
                expect( menu.getOrg().getText() ).to.eventually.contain( 'Organizations' ),
                expect( menu.getCourse().getText() ).to.eventually.equal( '' ),
                expect( menu.getModule().getText() ).to.eventually.equal( '' ),
                expect( menu.getList() ).to.eventually.have.length( 4 )])
        } );
/*
        it( 'should navigate using navTo Macro', function () {
            return expect( main.navTo( { organizations : 'surrey', courses : 'meditation' } ) )
                .to.eventually.contain( 'modules' )
        });
         */

    });
    describe ('Stories', function() {
        var menu,main,home,content,deferred,testPromise, journeys={};
        beforeEach( function () {
            browser.ignoreSynchronization = true;
            main = new MainPage();
            home = new HomePage();
            menu = new MenuPage();
            content = new ContentPage();
            deferred = Q.defer();
            testPromise = deferred.promise;
            journeys.subscribeMeditation = function () {
                return main.get().then( function () {
                    main.navTo( { organizations : 'surrey', courses : 'meditation' } )
                        .then( function () {
                            // switch can be missing
                            var main = new MainPage();
                            return main.getSwitch().click();
                        } );
                } );
            };
        } );
        afterEach( function () {
            browser.ignoreSynchronization = false;
            return takeScreenshot('test_' + new Date().getTime() );
        } );
        /*
        it( 'should start with an intro to the app',function() {
            home.get();
            expect ( home.getBlurb().getInnerHtml() ).to.eventually.contain('Welcome to Medit8');
        });
        it( 'should allow me to select a course from org page' ,function() {
            main.get();
            expect ( main.navTo ( { organizations: 'surrey', courses: 'meditation' } )
                    .then ( function ( what ) {
                    return main.clickOn( 'meditation' );
                })
            ).to.eventually.contain('guided meditations');
        });
        */
    });
});
