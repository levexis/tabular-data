/* main page object */
var Q = require( 'q' );
if ( typeof protractor === 'undefined' ) {
    protractor = require( 'protractor' );
}
module.exports = function () {
    var _that = this;
    this.main = element( by.css( '.main' ) );
    /* get the page */
    this.get = function ( navTo ) {
        browser.get( '/index.html' );
    };
    this.getHeading = function () {
        return this.main.element( by.tagName( 'h1' ) );
    };
    this.getName = function () {
        return this.main.element( by.model( 'model.name' ) );
    };
    this.getDob = function () {
        return this.main.element( by.model( 'model.dob' ) );
    };
    this.getDay = function () {
        return this.main.element( by.model( 'day' ) );
    };
    this.getMonth = function () {
        return this.main.element( by.model( 'month' ) );
    };
    this.getYear = function () {
        return this.main.element( by.model( 'year' ) );
    };
    this.getEmail = function () {
        return this.main.element( by.model( 'model.email' ) );
    };
    this.getKids = function () {
        return this.main.element( by.model( 'model.kids' ) );
    };
    this.getAdd = function () {
        return this.main.element( by.css( '.add-button' ) );
    };
    this.getTable = function () {
        return this.main.element( by.tagName( 'table' ) );
    };
    this.getRow = function ( which ) {
        if ( typeof which === 'undefined' ) {
            which = 'head';
        }
        return this.getTable().element( by.name( 'row' + which ) );
    };
    this.getRows = function ( which ) {
        return this.getTable().all( by.tagName( 'tr' ));
    };
    this.getCol = function ( number,rowElement ) {
        if ( !rowElement ) {
            rowElement = this.main.element( by.tagName( 'thead' ) );
        }
        return rowElement.element( by.name( 'col' + number ) );
    };
    this.getCell = function ( row, col ) {
        return this.getCol(  col , this.getRow ( row ));
    };

    this.getSortbox = function ( ) {
        return this.main.element( by.css( '.sort' ) );
    };
    this.getFilter = function ( row, number ) {
        return this.main.element( by.model( 'search' ) );
    };

    return this;
};
