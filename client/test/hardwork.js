/**
 * Created by paulcook on 24/08/15.
 */
function doWork(timeout) {
    var starttime = new Date(), i = 0, elapsed = 0;
    for ( i = 0; ( (!timeout || elapsed < timeout) ) ; i++ ) {
        elapsed = new Date().getTime() - starttime.getTime();
    }
    postMessage( 'work took ' + elapsed  );
}
// takes 1s
doWork(1000);