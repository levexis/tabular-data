angular.module( 'tabData' )
    .directive( 'tdDate', function () {
        return {
            restrict : 'E',
            require : '?ngModel',
            scope : {}, //isolate
            link : function ( $scope, element, attributes, ngModel ) {
                // set this year as the maximum year allowed if not set on attributes
                $scope.maxYear = attributes.maxYear || ( 1900 + new Date().getYear() );
                // ngModel is a required attribute
                if ( !ngModel ) return;
                // converts full year, added to scope for easy testing but could be a filter.
                $scope.fullYear = function ( year ) {
                    var thisYear, outCentury;
                    year *= 1;
                    if ( year < 100 ) {
                        // get the current century
                        thisYear = ( new Date().getYear() + 1900 ) + '';
                        outCentury = thisYear.substr( 0, 2 ) * 100;
                        if ( thisYear.substr( 2 ) < year ) {
                            //last century
                            outCentury -= 100;
                        }
                        return outCentury + year;
                    } else {
                        return year;
                    }
                };
                // formatters is called on every change, used to keep the local scope in sync if the model is reset
                ngModel.$formatters.push( function () {
                    if ( !ngModel.$modelValue ) {
                        $scope.day = $scope.month = $scope.year = undefined;
                    }
                } );
                // todo: use viewChangeListeners to all ng-model to be set to a date

                $scope.updateModel = function () {
                    // set the ng-model if complete date specified
                    if ( $scope.day && $scope.month && (typeof $scope.year !== 'undefined') ) {
                        ngModel.$setViewValue( new Date( $scope.fullYear( $scope.year ), $scope.month - 1, $scope.day ) );
                    }
                };
            },
            templateUrl : 'tpl/td-date.html'
        };
    } )
    /*
     * tdTabulate
     * creates a sortable table of required cols chosen in collection
     * required collection and col0,col1...col[n]
     */
    .directive( 'tdTabulate', function () {
        return {
            restrict : 'E',
            scope : { collection : '=collection' },
            link : function ( $scope, element, attributes ) {
                // sort ascending on first column to begin with
                $scope.desc = false;
                $scope.sortName = attributes['col0'];
                // changes column or toggles sort direction
                $scope.clickCol = function ( col ) {
                    if ( $scope.sort !== col ) {
                        // changed column set to descending
                        $scope.sort = col;
                        $scope.sortName = attributes['col' + col];
                        $scope.desc = true;
                    } else {
                        $scope.desc = !$scope.desc;
                    }
                };
            },
            template : function ( element, attributes ) {
                var cols = 0,
                    startTemplate = '<div class="tabulate" ng-show="collection.length"><label>Filter:</label><input ng-model="search" placeholder="Enter text to filter" required/><br /><table class="table"><thead><tr name="rowhead">',
                    endTemplate = '<tbody><tr ng-class-even="\'even\'" ng-repeat="row in collection | tdFilterValues:search | orderBy:sortName:desc" name="row{{$index}}">';
                // have put a limit of 999 on to prevent crashing on corrupt / invalid data
                while ( attributes['col' + cols] && cols < 999 ) {
                    startTemplate += '<td ng-click="clickCol(' + cols + ')" ng-class="{ \'asc\' : sort===' + cols + ' && !desc, \'desc\' :  sort===' + cols + ' && desc}" name="col'+cols+'">' + attributes['col' + cols ] + '</td>';
                    endTemplate += '<td name="col' + cols + '">{{ row.' + attributes['col' + cols ] + ' | tdFormatCell }}</td>';
                    cols += 1;
                }
                // only return a table if columns specified
                if ( cols ) {
                    startTemplate += '</tr></thead>';
                    endTemplate += '</tr></tbody></table><p class="sort">Table sorted by: <span>{{sortName}} {{desc ? "Descending" : "Ascending"}}</span></p></div>';
                    return startTemplate + endTemplate;
                } else {
                    // columns need to be specified, allows for ordering to be set and key columns to be hidden
                    // could make them optional and then use the columns from the first row of the collection, if collection is not empty
                    return 'col0 required for tabulate';
                }
            }
        };
    } )
    // filter to allow all text values to be searched, ignores hashkey and non string fields
    // this is because native filter only allows searching of single field or all fields
    .filter( 'tdFilterValues', function () {
        return function ( collection, what ) {
            var out,
                keys,
                search,
                row,
                i,
                found;

            if ( !what || !collection ) {
                // return full collection if no criteria specifed
                out = collection;
            } else {
                out = [];
                // case insensitive search of text fields
                search = new RegExp( what, 'i' );
                for ( var r = 0; r < collection.length; r++ ) {
                    row = collection [r];
                    keys = Object.keys( row );
                    i = 0;
                    found = false;
                    // appending matching rows to out and check next
                    while ( !found && i < keys.length ) {
                        if ( keys[i].substr( 0, 1 ) !== '$' &&
                            typeof row[ keys[i] ] === 'string' &&
                            search.test( row[ keys[i] ] ) ) {
                            found = true;
                            out.push( row );
                        }
                        i += 1;
                    }
                }
            }
            return out;
        };
    } )
    // presents the date in d/m/yyyy
    .filter( 'tdFormatCell', function () {
        return function ( cell ) {
            if ( cell instanceof Date ) {
                return cell.getDate() +
                    '/' + ( cell.getMonth() + 1 ) +
                    '/' + (cell.getYear() + 1900);
            } else {
                return cell;
            }
        };
    } );
