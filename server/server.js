var express = require('express' ),
    app = express();

var server = app.listen(3000, function (req, res, next) {

    //add in a delay of n ms if ?delay=[n] specified, called before static routes
    app.use ( function (req , res, next) {
        // set cache expire headers
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        console.log(req.query);
        if ( req.query['delay'] ) {
            console.log ('delay',req.location,'by', req.query.delay);
            setTimeout( function () {
                next();
            }, req.query.delay );
        } else {
            next();
        }
    });
    app.use(express.static(__dirname + '/../client/', { maxAge: 0 })); // do not cache static content
    console.log ( 'listening on port 3000 - use ?delay=n - static route', __dirname  + '/../client/' );

});
