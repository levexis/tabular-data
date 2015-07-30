// timer for testing script loading in browser based on where content is placed.
// if you want to track initial start time put window.results = new Date() at start of html
(function () {
    var results, labels;
    window.results = window.results || [];
    results = window.results;
    function getQueryParams(str) {
        return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
    }
    function displayResults() {
        var out = '',
            el = document.getElementById( 'results' );
        if ( el ) {
            for ( var i = 1; i < results.length; i++ ) {
                // calculate elapsed time, could also log window load and dom ready
                out += '<p>' + document.location.search + i + ': ' + ( results[i].getTime() - results[0].getTime() ) + '</p>';
            }
            el.innerHTML = out;
        }
        return out;
    }
    results.push( new Date() );
    displayResults();
})();
