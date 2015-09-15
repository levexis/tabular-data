/**
 * Created by paulcook on 24/08/15.
 */
makeNothing = function () {
    return function () {
        doNothing( timeout )
        {
            var starttime = new Date(), i = 0, elapsed = 0, a = [];
            if ( typeof cycles === 'undefined' ) {
                cycles = 1000000;
            }
            console.log( 'starting something', starttime );
            for ( i = 0; ( (!cycles || i < cycles) && (!timeout || elapsed < timeout) ); i++ ) {
                elapsed = new Date().getTime() - starttime.getTime();
                a.push( document.getElementsByTagName( 'head' ).count );
            }
            console.log( 'something took ', elapsed );
            return elapsed;
        }
    }
writeScript('blank.js?delay=2000&sync2&recursive');
