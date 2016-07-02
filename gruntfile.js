module.exports = function(grunt){

    /*
     * Without matchdep, we would have to write grunt.loadNpmTasks("grunt-task-name"); 
     * for each dependency, which would quickly add up as we find and install other plugins.
     */
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /*
         * Clean files and folders
         */        
        //clean:["build"],

        /*
         * Concatenate files
         */
        concat: {
            options: {
                separator: ';',
            },
            deps: {
                src: [
                    'node_modules/underscore/underscore.js',
                    'node_modules/gmaps/gmaps.js',
                    'node_modules/hammerjs/hammer.js',
                ],
                dest: 'build/js/deps.js',
            },
            main: {
                src: ['client/js/**/*.js', 'client/js/*.js', '!client/js/ga.js'],
                dest: 'build/js/main.js',
            },
            ga: {
                src: ['client/js/ga.js'],
                dest: 'build/js/ga.js',
            },
        },

        /*
         * Copy files and folders
         */
        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, src: ['client/assets/images/*'], dest: 'build/medias/images/'},
                    {expand: true, flatten: true, src: ['client/assets/videos/*'], dest: 'build/medias/videos/'},
                    {expand: true, flatten: true, src: ['client/assets/fonts/*'], dest: 'build/fonts/'},
                    {expand: true, flatten: true, src: ['client/**/*.html'], dest: 'build/'},
                    
                    {expand: true, cwd: 'node_modules/angular2',  src: '**/*', dest: 'build/node_modules/angular2'},
                    {expand: true, cwd: 'node_modules/@angular',  src: '**/*', dest: 'build/node_modules/@angular'},
                    {expand: true, cwd: 'node_modules/angular2',  src: '**/*', dest: 'build/node_modules/angular2'},
                    {expand: true, cwd: 'node_modules/es6-promise',  src: '**/*', dest: 'build/node_modules/es6-promise'},
                    {expand: true, cwd: 'node_modules/es6-shim',  src: '**/*', dest: 'build/node_modules/es6-shim'},
                    {expand: true, cwd: 'node_modules/reflect-metadata',  src: '**/*', dest: 'build/node_modules/reflect-metadata'},
                    {expand: true, cwd: 'node_modules/zone.js',  src: '**/*', dest: 'build/node_modules/zone.js'},
                    {expand: true, cwd: 'node_modules/core-js',  src: '**/*', dest: 'build/node_modules/core-js'},
                    {expand: true, cwd: 'node_modules/systemjs',  src: '**/*', dest: 'build/node_modules/systemjs'},
                    {expand: true, cwd: 'node_modules/rxjs',  src: '**/*', dest: 'build/node_modules/rxjs'},

                    {expand: true, flatten: true, src: ['systemjs.config.js'], dest: 'build/node_modules/'}
                ],
            },
        },    

        /*
         * grunt-cssc combines CSS rules together, ensuring that the generated CSS has minimal repetition.
         */
        cssc: {
            build: {
                options: {
                    consolidateViaDeclarations: true,
                    consolidateViaSelectors:    true,
                    consolidateMediaQueries:    true
                },
                files: {
                    'build/css/master.css': 'build/css/master.css'
                }
            }
        },

        /*
         * grunt-contrib-cssmin make the outputted file is the smallest possible. 
         * It not only trims out white space, but transforms colors to their shortest possible values.
         */
        cssmin: {
            build: {
                src: 'build/css/master.css',
                dest: 'build/css/master.css'
            }
        },

        /*
         * Start (and supervise) an Express.js web server using grunt.js, works well with socket.io
         */
        express: {
            options: {
                port: 2016,
                hostname: "*",
                bases: ["build"],
                livereload: true
            },

            dev: {
                options: {
                    script: 'server/server.js'
                }
            },

            prod: {
                options: {
                    script: 'server/server.js',
                    node_env: 'production'
                }
            },

            test: {
                options: {
                    script: 'server/server.js'
                }
            }
        },

        /*
         * Validating HTML with HTMLHint:
         * it will check through the source file and make sure that our HTML has no errors.
         */
         htmlhint: {
            build: {
                options: {
                    'tag-pair': true,
                    // Force tags to have a closing pair
                    'tagname-lowercase': true,
                    // Force tags to be lowercase
                    'attr-lowercase': true,
                    // Force attribute names to be lowercase e.g. <div id="header"> is invalid
                    'attr-value-double-quotes': true,
                    // Force attributes to have double quotes rather than single
                    'doctype-first': true,
                    // Force the DOCTYPE declaration to come first in the document
                    'spec-char-escape': true,
                    // Force special characters to be escaped
                    'id-unique': true,
                    // Prevent using the same ID multiple times in a document
                    'head-script-disabled': true,
                    // Prevent script tags being loaded in the  for performance reasons
                    'style-disabled': true
                    // Prevent style tags. CSS should be loaded through 
                },
                src: ['index.html']
            }
        },

        /*
         * Validate files with JSHint
         */
        jshint: {
            all: ['gruntfile.js', 'client/js/*.js', 'client/js/**/*.js', '!client/js/vendor/*.js', '!client/js/ga.js']
        },

        /*
         * Compile markdown files with yml view context into html
         */
        md: {
            posts: {
                src: 'wiki/**/*.md',
                dest: 'wiki_compiled/'
            }
        },

        /*
         * Compile SASS/SCSS to CSS
         */
        sass : {
            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'build/styles/main.css': 'client/sass/master.scss'
                }
            },
            build: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'build/styles/main.min.css': 'client/sass/master.scss'
                }
            }
        },

        /*
         * Grunt task for converting a set of images into a spritesheet and corresponding CSS variables.
         */
        sprite:{
            all: {
                src: 'client/assets/sprites/*.png',
                dest: 'build/assets/sprites/sprites.png',
                destCss: 'client/sass/assets/_sprites.scss',
                imgPath: '../assets/sprites/sprites.png',
                padding: 8
            }
        },

        typescript: {
            base: {
                src: ['client/app/**/*.ts'],
                dest:'build/app',
                options: {
                    "target": "es5",
                    "module": "commonjs",
                    "moduleResolution": "node",
                    "sourceMap": true,
                    "emitDecoratorMetadata": true,
                    "experimentalDecorators": true,
                    "removeComments": false,
                    "noImplicitAny": false
                }
            }
        },

        typings: {
            install: {}
        },

        /*
         * UglifyJS compresses all of the variable and function names in source files to take up
         * as little space as possible, and then trims out white space and comments
         */
        uglify: {
            dist: {
                options: {
                    compressed: true
                },
                files: [{
                    expand: true,
                    cwd: 'build/js',
                    src: '*.js',
                    dest: 'build/js',
                    ext: '.min.js'
                }]
            }
        },

        /*
         * Generate custom icon webfonts from SVG files via Grunt
         */
        webfont: {
            icons: {
                src: ['client/assets/icons/*.svg'],
                dest: 'build/fonts',
                destCss: 'client/sass/fonts',
                options: {
                    fontFilename: "ico",
                    hashes: false,
                    stylesheet: "scss",
                    engine: "node",
                    relativeFontPath: "../fonts",
                    htmlDemo: true,
                    destHtml: 'build/assets',
                    sourcemap: 'none',
                    templateOptions: {
                        baseClass: "ico",
                        classPrefix: "ico-",
                        mixinPrefix: "ico-"
                    }
                }
            }
        },

        /*
         * =======================================================
         * Watch for changes:
         * Automate tasks that run every time a file is saved.
         * =======================================================
         */
        watch: {
            options: {
                livereload: true,
            },
            html: {
                files: ['client/**/*.html'],
                tasks: ['htmlhint'],
                options: {
                livereload: true,
            }
            },            
            css: {
                files: ['client/sass/**/*.scss'],
                tasks: ['css']
            },
            copy: {
                files: ['client/**/*'],
                tasks: ['copy'],
            },
            webfont: {
                files: ['client/assets/icons/*.svg'],
                tasks: ['webfont'],
            },
            sprite: {
                files: ['client/assets/sprites/*.png'],
                tasks: ['sprite'],
            },
            js: {
                files : ['client/js/*.js', 'client/js/**/*.js'],
                tasks: ['js']
            },
            ts: {
                files : ['client/app/**/*.ts'],
                tasks: ['typescript']
            }
        }
    });

    grunt.registerTask('default', []);

    grunt.registerTask('assets', ['copy', 'sprite', 'webfont']);
    grunt.registerTask('css',  ['sass', 'cssc', 'cssmin']);
    grunt.registerTask('js', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('build', ['clean', 'assets', 'css', 'typescript', 'js']);

    grunt.registerTask(
        'front',
        'Install npm modules, built and display logs for front updates',
        ['build', 'express:dev', 'watch']
    );
    grunt.registerTask(
        'deploy',
        'Install npm modules, built and display logs for server updates',
        ['build', 'express:dev']
    );
    grunt.registerTask(
        'heroku',
        'Install npm modules, built and display logs for server updates',
        ['build']
    );
    ///
};