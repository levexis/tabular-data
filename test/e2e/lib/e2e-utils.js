var fs = require( 'fs' ),
    ARTIFACT_DIR = process.env['ARTIFACT_DIR'] || process.env['CIRCLE_ARTIFACTS'],
    Q = require( 'q' );

// make the directory for screentshot if local, if ci remaking this will destroy link to artifacts
if ( process.env['ARTIFACT_DIR'] ) {
    try {
        fs.mkdirSync( ARTIFACT_DIR );
    } catch ( e ) {
        if ( e.code != 'EEXIST' ) throw e;
    }
}
// takes a screenshot, optional filename and next returns promise resolved on screenshot
module.exports = {
    // takes a screenshot if ARTIFACT_DIR or CIRCLE_ARTIFACTS environment variables are ssset
    takeScreenshot : function takeScreenshot( filename, next ) {
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
};