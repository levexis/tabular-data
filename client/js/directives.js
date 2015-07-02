angular.module( 'tabData' )
    // tdDate, simple date control that allows dates to be typed, works with ie and firefox which don't support date inputs
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
                // todo: set intial day, month, year inputs if ng model set to a date using viewChangeListeners
                // validates the inputs and sets the ngModel if a validate date, otherwise returns false
                $scope.updateModel = function () {
                    var newDate;
                    // checks day, month, year is a real date, eg 29/2/2015 no 29/2/2016 yes.
                    function validDate( newDate ) {
                        if (  newDate.getDate() ==  $scope.day
                            && ( newDate.getMonth() + 1 ) ==  $scope.month
                            && ( newDate.getYear() + 1900) == $scope.fullYear( $scope.year ) ) {
                            ngModel.$setValidity('tdDate',true);
                            // set valid class just in case has been removed as control will not trigger a state change event in sub input
                            angular.element(element.find('input')[0]).addClass('ng-valid');
                            angular.element(element.find('input')[1]).addClass('ng-valid');
                            return true;
                        } else {
                            // date is invalid, prevent form submission - really should use a custom directive for the inputs and then expose their ngModel to parent scope
                            // but better still use an off the shelf date control that works cross browser
                            ngModel.$setValidity('tdDate',false);
                            // set the day month as invalid
                            angular.element(element.find('input')[0]).removeClass('ng-valid');
                            angular.element(element.find('input')[1]).removeClass('ng-valid');
                            return false;
                        }
                    }
                    // set the ng-model if complete date specified
                    if ( $scope.day && $scope.month && (typeof $scope.year !== 'undefined') ) {
                        newDate = new Date( $scope.fullYear( $scope.year ), $scope.month - 1, $scope.day );
                        // check the day month year is valid if not then invalidate the day
                        if (  validDate( newDate ) ) {
                            ngModel.$setViewValue( new Date( $scope.fullYear( $scope.year ), $scope.month - 1, $scope.day ) );
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
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
                var cols=0;
                // intialise columns, required and must be continuous - eg col0, col1
                // have put a limit of 999 on to prevent crashing on corrupt / invalid data
                // todo: could use the names of the first row in collection once it exists
                $scope.colNames = [];
                while ( attributes['col' + cols] && cols < 999 ) {
                    $scope.colNames.push ( attributes['col' + cols] );
                    cols++;
                }
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
            templateUrl: 'tpl/td-tabulate.html'
        };
    } )
    // filter to allow all text values to be searched, ignores hashkey and non string fields
    // this is because native filter only allows searching of single field or all fields and this can
    // lead to false matches on numbers and dates ( which it converts to the Month! )
    .filter( 'tdFilterValues', function () {
        return function ( collection, what ) {
            var out, keys,search,row,i,found;

            if ( !what || !collection ) {
                // return full collection if no criteria specified
                out = collection;
            } else {
                out = [];
                // case insensitive search of text fields
                search = new RegExp( what, 'i' );
                // r = row index
                for ( var r = 0; r < collection.length; r++ ) {
                    row = collection [r];
                    keys = Object.keys( row );
                    // i= key index
                    i = 0;
                    found = false;
                    // iterate through rows and append matching rows to out and check next
                    while ( !found && i < keys.length ) {
                        // search any string field, except those that are prepended by $ as these are angular internals
                        if ( keys[i].substr( 0, 1 ) !== '$' &&
                            typeof row[ keys[i] ] === 'string' &&
                            search.test( row[ keys[i] ] ) ) {
                            found = true;
                            // skip to next row one you have a match as search is an or.
                            out.push( row );
                        }
                        i++;
                    }
                }
            }
            return out;
        };
    } )
    // this auto formats cells, formats dates in d/m/yyyy and leaves other types alone
    .filter( 'tdFormatCell', function ( dateFilter ) {
        return function ( cell ) {
            if ( cell instanceof Date ) {
                return dateFilter( cell , 'd/M/yyyy');
            } else {
                return cell;
            }
        };
    } );
