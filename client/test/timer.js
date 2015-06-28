// timer for testing script loading in browser based on where content is placed.
// if you want to track initial start time put window.results = new Date() at start of html
(function () {
    window.results = window.results || [];
    function displayResults() {
        var out = '',
            el = document.getElementById( 'results' );
        if ( el ) {
            for ( var i = 1; i < results.length; i++ ) {
                // calculate elapsed time, could also log window load and dom ready
                out += '<p>' + i + ': ' + ( results[i].getTime() - results[0].getTime() ) + '</p>';
            }
            el.innerHTML = out;
        }
        return out;
    }
    window.results.push( new Date() );
    displayResults();
})();
