/*
 * use this configuration for developing on mac, it does not generate coverage reports to do those run
 * standard karma without specifing config or use npm test
 * this assumes you have a standard set of browsers and want to autorun tests and you have installed chrome
 * and firefox but not Opera or IE. We install phantom, this is what is used in e2e testing (npm test).
 * Use:
 * node_modules/karma/bin/karma start karma.macdev.conf.js
 */

// basic Karma configuration for e2e testing use, runs once and uses phantomjs
module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',

        // frameworks to use, these need to be specified in plugins below
        frameworks: [ 'mocha', 'sinon-chai'],

        files : [
            'lib/angular/angular.js',
            'client/js/**/*.js',
            'lib/angular-mocks/angular-mocks.js',
            'test/unit/**/*.js',
            'client/tpl/*.html'
        ],

        exclude: [
            'js/scripts/vendor/**/*.js'
//            'app/lib/angular/angular-scenario.js'
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['spec','progress'],//,'html'], // need to install spec using,

/*        // added html reporter add html if you need it
        htmlReporter: {
            outputFile: 'test/report.html'
        },
*/
        // web server port
        port: 9876,

        // CLI --runner-port 9100
        runnerPort : 9100,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
//        logLevel: config.LOG_DEBUG,
        logLevel: config.LOG_ERROR,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        // browsers need to be in plugins below
        browsers: [ 'Chrome' , 'Firefox', 'PhantomJS','Safari','Opera' ],
        //browsers: [  'PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false, // not for run once

        // these need to be in your dev dependencies in package.json
        plugins: [
            "karma-mocha",
            "karma-sinon-chai",
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-safari-launcher',
            'karma-phantomjs-launcher',
            'karma-ie-launcher',
            'karma-htmlfile-reporter',
            'karma-coverage',
            'karma-spec-reporter',
            'karma-ng-html2js-preprocessor'
        ],

        preprocessors: {
            'client/tpl/*.html' : ['ng-html2js']
        },
        ngHtml2JsPreprocessor: {
            // the name of the Angular module to create
            stripPrefix: "client/",
            moduleName: "tabData"
        }

    });
};