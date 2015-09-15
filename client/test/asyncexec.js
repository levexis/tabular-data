/**
 * Created by paulcook on 24/08/15.
 */
function doSomething(cycles, timeout) {
    var starttime = new Date(), i = 0, elapsed = 0, a = [];
    if ( typeof cycles === 'undefined' ) {
        cycles = 1000000;
    }
    for ( i = 0; ( (!cycles || i < cycles) && (!timeout || elapsed < timeout) ) ; i++ ) {
        elapsed = new Date().getTime() - starttime.getTime();
        a.push( document.getElementsByTagName( 'head' ).count );
    }
    console.log('something took ', elapsed  );
    logEvent('finishedSomething')()
    return elapsed;
}
// takes 500 ms
doSomething(false,500);