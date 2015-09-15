/**
 * Created by paulcook on 27/08/15.
 */
function doWaterfall ( data, options ) {
    options = options || {};
    var chartData = [],
        chartLabels = [],
        chartPlotLines = [],
        config;
    if ( typeof data !== 'object' || !Object.keys( data ) ) {
        throw new Error( 'data required' );
    }
    // split data
    $.each( data, function ( src, timeArr ) {
        chartLabels.push( src );
        chartData.push( timeArr );
    } );
    // create plotlines
    $.each ( options.plotLines || '' , function ( i , plotLine ) {
        chartPlotLines.push( {
            label: { text : plotLine.name} ,
            color : plotLine.color || 'black',
            width : plotLine.width || 2,
            dashStyle : plotLine.dashStyle || 'Dash',
            value : plotLine.value} );
    });
    config = {
        chart : {
            type : 'columnrange',
            inverted : true
        },
        'credits' : {
            'enabled' : true,
            'href' : '',
            'position' : {
                'x' : -15
            },
            'text' : 'Copyright NCC Group Website Performance'
        },

        title : {
            text : options.title || ''
        },

        subtitle : {
            text : options.subtitle || ''
        },

        xAxis : {
            categories : chartLabels,
            opposite : true
        },

        yAxis : {
            title : {
                text : 'Elapsed time (ms)'
            },
            min : 0,
            max : options.maxVal || undefined,
            plotLines : chartPlotLines
        },

        tooltip : {
            valueSuffix : 'ms'
        },

        plotOptions : {
            columnrange : {
                dataLabels : {
                    enabled : false, // have disabled as not screenshotting correctly on mac
                    formatter : function () {
                            // can also change colors here for showing if an event is
                            // after another event etc
                            if ( this.y === this.point.low ) {
//                                return '';
                                return ( Math.round( this.y / 100) /10 ) + 's'; // seconds in 1 decimal place
                            } else {
                                // only label end time
                                // returns sum
//                                return '( ' + (this.point.high-this.point.low) + 'ms ) ';
                                return ( Math.round( this.y / 100) /10 ) + 's'; // seconds in 1 decimal place
//                                return this.y + 'ms';
                            }
                    }
                }
            }
        },

        legend : {
            enabled : false
        },

        series : [
            {
                name : 'Load Time',
                color : 'lightgreen',
                border : "darkred",
                data : chartData
            }
        ]

    };
    $( '#chart' ).highcharts( config );
}
function chartNavTimings( search , fileNameOnly ) {
    function getPathEnd( href ) {
        var regex = /([^\/]*)$/;
        return href.match( regex )[0];
    }
    var name,
        data = {},
        options = { plotLines : [
            { name : 'Dom Complete' ,
                value: performance.timing.domContentLoadedEventEnd - performance.timing.responseEnd,
                color: 'red'},
            { name: 'On Load',
                value:performance.timing.loadEventEnd - performance.timing.responseEnd,
                color: 'green'} ] },
        maxVal = performance.timing.loadEventEnd - performance.timing.responseEnd;

    $.each( performance.getEntriesByType( "resource" ), function ( i, res ) {
        if ( !search || res.name.match( search ) ) {
            name = fileNameOnly ? getPathEnd ( res.name ) : res.name;
            data[ name ] = [ Math.round ( res.fetchStart ), Math.round (res.responseEnd) ];
            if (  res.responseEnd > maxVal ) {
                maxVal = res.responseEnd;
            }
        }
    } );
    options.maxVal = maxVal * 1.1;
    console.log (data,options);
    doWaterfall( data,options);
}
function chartDiv (search) {
    search = search || '';
    $( 'body' ).append( '<div id="chart" style="width:100%; height:400px;"><a href="#" onclick="chartNavTimings(\'' + search + '\')">click to chart</a></div>' );
}
function appendScript (src , onload) {
    var head = document.getElementsByTagName( "head" )[0];
    var js = document.createElement( "script" );
    js.onload = onload;
    js.src = src;
    head.appendChild( js );
}

// requires code from blockers.html
function addLibs ( onload ) {
//need jquery first
    function doHighcharts() {
        appendScript( "http://code.highcharts.com/highcharts.js",
            function () {
                appendScript( "http://code.highcharts.com/highcharts-more.js", function () {
                    appendScript( "http://code.highcharts.com/modules/exporting.js", function () {
                        if ( typeof onload === 'function' ) {
                            onload();
                        }
                    } );
                } );
            } );
    }
    if ( typeof $ !== 'function' ) {
        appendScript( 'http://code.jquery.com/jquery-latest.min.js', doHighcharts );
    } else {
        doHighcharts();
    }
}
function bootstrap( search , fileNameOnly ) {
    addLibs ( function () { chartDiv(); chartNavTimings ( search , fileNameOnly ); } );
}
//bookmarklet version
//javascript:(function(){var e=document,t=e.createElement("script");t.onload=function(){bootstrap('delay',true);},t.src="//127.0.0.1/levexis/tabular-data/client/test/perfcharts.js";document.getElementsByTagName("head")[0].appendChild(t)})();
//all pages
//javascript:(function(){var e=document,t=e.createElement("script");t.onload=function(){bootstrap('');},t.src="//127.0.0.1/levexis/tabular-data/client/test/perfcharts.js";document.getElementsByTagName("head")[0].appendChild(t)})();

