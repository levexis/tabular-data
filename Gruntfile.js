/* to build in testflight */
//account 97fea4a9ffaa8bb7a22f21a18b5e31e5_MjAzMjk1NTIwMTQtMDgtMTEgMTc6MDE6MzUuODMyNTg4
//team    248dcb1a3e396b99e50c047c5424913a_NDI3NjU1MjAxNC0wOS0wMiAwNTowOToxNy45MDMzMzc
//ipa distribute:testflight -a 97fea4a9ffaa8bb7a22f21a18b5e31e5_MjAzMjk1NTIwMTQtMDgtMTEgMTc6MDE6MzUuODMyNTg4 -T 248dcb1a3e396b99e50c047c5424913a_NDI3NjU1MjAxNC0wOS0wMiAwNTowOToxNy45MDMzMzc
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig( {
        pkg : grunt.file.readJSON( 'package.json' ),
        banner : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>; */\n',
        // Task configuration.
        bower : {
            install : {
            }
        },
        karma : {
            options : {
                configFile : 'karma.conf.js',
                runnerPort: 9100,
                browsers:   ['Chrome']
            }
        },
        // note clean with / on the end as without the * removes the directory, which I see as a bug
        clean:       ['test/artifacts/*', 'client/scripts/vendor/*'],
        copy : {
            main : {
                files : [
                    {expand : true, flatten : true, cwd : 'lib/angular/', src : '*.js*', dest : 'client/js/vendor/' }
                ]
            }
        },
        jshint : {
            options : {
                jshintrc : './.jshintrc',
                force : true
            },
            gruntfile : {
                src : 'Gruntfile.js'
            },
            all : {
                options : {
                    ignores : [
                        'client/js/vendor/**/*.js'
                    ]
                },
                src : [
                    'client/**/*.js'
                ]
            }
        },
        connect : {
            e2e : {
                options : {
                    port : 9000,
                    base : 'client',
                    hostname : '*'
                }
            },
            dev : {
                options : {
                    port : 9000,
                    base : 'client',
                    hostname : '*',
                    keepalive : true
                }
            }
        },
        protractor : {
            options : {
                noColor : false
            },
            dev : {
                options: {
                    configFile: 'protractor.conf.dev.js"', // Target-specific config file
                    args: {}
                }
            },
            ci: {
                options : {
                    configFile : 'protractor.conf.js', // Target-specific config file
                    args : {}
                }
            }
        },
        selenium_start : {
            options : { timeout : 9999}
        }

    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint' );
    grunt.loadNpmTasks('grunt-selenium-webdriver' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    // use grunt phonegap:build:android
    grunt.loadNpmTasks('grunt-mocha-cli');

    grunt.registerTask('e2e', [
        'selenium_phantom_hub',
        'connect:e2e',
        'protractor:ci',
        'selenium_stop'
    ]);
    grunt.registerTask('e2e:dev', [
        'selenium_start',
        'connect:e2e',
        'protractor:dev',
        'selenium_stop'
    ]);

    // use this for testing via webstorm
    grunt.registerTask('webstorm', [
        'selenium_phantom_hub',
        'connect:dev'
    ]);

    // use this for testing via protractor client
    grunt.registerTask('procli', [
        'selenium_start',
        'connect:dev'
    ]);

    // test task
    grunt.registerTask( 'test', [ 'karma' ]);

    // Default task.
    grunt.registerTask( 'build', ['clean', 'bower', 'copy' , 'jshint' ] );

    // Default task.
    grunt.registerTask( 'default', ['build' ] );

};
