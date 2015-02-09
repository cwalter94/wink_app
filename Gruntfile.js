module.exports = function(grunt) {
    this.loadNpmTasks('grunt-contrib-watch');
    this.loadNpmTasks('grunt-contrib-sass');
    this.loadNpmTasks('grunt-contrib-uglify');
    this.loadNpmTasks('grunt-ng-annotate');
    this.loadNpmTasks('grunt-contrib-cssmin');

    this.initConfig({
        sass: {
            dist: {
                files: {
                    'public/css/all.css': 'scss/all.scss'
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: [
                    {
                        'public/js/angular/ngApp.annotated.js': ['public/js/angular/ngApp.js', 'public/js/angular/**/*.js', '!public/js/angular/**/*.annotated.js']
                    }
                ]
            }
        },
        cssmin: {
            target: {
                files: [{
                    src: [
                        'public/bower_components/angular-loading-bar/build/loading-bar.css',
                        'public/css/all.css',
                        'public/bower_components/angular-xeditable/dist/css/xeditable.css',
                        'public/bower_components/angular-ui/build/angular-ui.min.css'
                    ],
                    dest: 'public/css/application.min.css'
                }],
                options: {
                    rebase: true,
                    target: 'public/css/'
                }
            }
        },
        uglify: {
            js: {
                files: [{
                    src: [
                        'public/bower_components/angular/angular.min.js',
                        'public/bower_components/angular-loading-bar/build/loading-bar.js',
                        'public/bower_components/angular-animate/angular-animate.js',
                        'public/bower_components/angular-bootstrap/ui-bootstrap.min.js',
                        'public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                        'public/bower_components/angular-xeditable/dist/js/xeditable.min.js',
                        'public/bower_components/angular-ui-select/dist/select.min.js',
                        'public/bower_components/angular-flash/dist/angular-flash.min.js',
                        'public/bower_components/angular-ui-router/release/angular-ui-router.min.js',
                        'public/bower_components/angular-ui/build/angular-ui.min.js',
                        'public/bower_components/angular-timer/dist/angular-timer.min.js',
                        'public/bower_components/angular-ui-utils/ui-utils.js',
                        'public/js/angular/ngApp.annotated.js'

                    ],
                    dest: 'public/js/application.min.js'
                }],
                options: {
                    preserveComments: false,
                    mangle: false,
                    compress: false,
                    sourceMap : true,
                    sourceMapName : 'public/js/application.min.js.map'
                }
            }
        },

        watch: {
            sass: {
                files: ['scss/*.scss'],
                tasks: ['sass']
            },
            css: {
                files: [
                    'public/css/bootstrap.min.css',
                    'public/font-awesome/css/font-awesome.min.css',
                    'public/css/animate.css',
                    'public/css/style.css',
                    'public/color/default.css',
                    'bower_components/angular-ui-select/dist/select.min.css',
                    'bower_components/selectize/dist/css/selectize.default.css',
                    'bower_components/select2/select2.css',
                    'bower_components/angular-xeditable/css/xeditable.css',
                    'bower_components/angular-ui/build/angular-ui.min.css',
                    'bower_components/textAngular/src/textAngular.css',
                    'public/css/all.css'
                ],
                tasks: ['cssmin']
            }
        }
    });

    return this.registerTask('default', ['sass', 'ngAnnotate', 'uglify', 'cssmin', 'watch']);
};
