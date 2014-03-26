module.exports = function(grunt) {
  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      install: {
        options: {
          targetDir: './lib',
          layout: 'byType',
          install: true,
          verbose: false,
          cleanTargetDir: true,
          cleanBowerDir: false
        }
      }
    },
    stylus: {
      compile: {
        options: {
          compress: false
        },
        files: {
          'public/stylesheets/result.css': 'app/styles/application.styl', // 1:1 compile
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'app/**/*.js'],
      server: ['server.js', 'routes/index.js']
    },
    uglify: {
      options: {
        beautify: true,
        mangle: false,
      },
      vendors: {
        options: {
          sourceMapPrefix: 2,
          sourceMap: 'public/javascripts/vendors.min.map'
        },
        files: {
          'public/javascripts/vendors.min.js': [
            'lib/jquery/jquery.js',
            'lib/handlebars/handlebars.js',
            'lib/swag/swag.js',
            'lib/underscore/underscore.js',
            'lib/backbone/backbone.js',
            'lib/backbone.wreqr/lib/backbone.wreqr.js',
            'lib/backbone.babysitter/backbone.babysitter.js',
            'lib/backbone.supermodel/build/backbone.supermodel.js',
            'bower_components/marionette/lib/core/backbone.marionette.js',
            'lib/backbone.marionette.handlebars/backbone.marionette.handlebars.js',
            'lib/microplugin/microplugin.js',
            'lib/sifter/sifter.js',
            'lib/spin.js/spin.js',
            'lib/moment/moment.js',
            'bower_components/ie-alert/theplugin/iealert.js'
          ]
        }
      },
      app: {
        options: {
          sourceMapPrefix: 2,
          sourceMap: 'public/javascripts/app.min.map'
        },
        files: {
          'public/javascripts/app.min.js': [
            'app/**/*.js'
          ]
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/stylesheets/app.css': [
            'bower_components/HTML5-Reset/assets/css/reset.css',
            'lib/font-awesome/css/font-awesome.css',
            'lib/pocketgrid/pocketgrid.css',
            'public/stylesheets/result.css'
          ]
        }
      }
    },
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      css: {
        src: [
          'bower_components/HTML5-Reset/assets/css/reset.css',
          'lib/font-awesome/css/font-awesome.css',
          'lib/pocketgrid/pocketgrid.css',
          'public/stylesheets/result.css'
        ],
        dest: 'public/stylesheets/app.css',
      },
      app: {
        src: [
          'app/**/*.js'
        ],
        dest: 'public/javascripts/app.min.js',
      },
      jsDev: {
        src: [
          'lib/jquery/jquery.js',
          'lib/handlebars/handlebars.js',
          'lib/swag/swag.js',
          'lib/underscore/underscore.js',
          'lib/backbone/backbone.js',
          'lib/backbone.wreqr/lib/backbone.wreqr.js',
          'lib/backbone.babysitter/backbone.babysitter.js',
          'lib/backbone.supermodel/build/backbone.supermodel.js',
          'bower_components/marionette/lib/core/backbone.marionette.js',
          'lib/backbone.marionette.handlebars/backbone.marionette.handlebars.js',
          'lib/microplugin/microplugin.js',
          'lib/sifter/sifter.js',
          'lib/spin.js/spin.js',
          'lib/moment/moment.js',
          'bower_components/ie-alert/theplugin/iealert.js'
        ],
        dest: 'public/javascripts/vendors.min.js',
      },
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'lib/font-awesome/fonts/*',
            ],
            dest: 'public/fonts/',
            filter: 'isFile'
          },
          {
            expand: true,
            flatten: true,
            src: [
              'lib/font-awesome/css/*.css'
            ],
            dest: 'public/stylesheets/',
            filter: 'isFile'
          },


        ]
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: "Templates",
          processName: function(filePath) { // input:  templates/_header.hbs
            var pieces = filePath.split("/");
            return pieces[pieces.length - 1].split(".")[0]; // output: _header.hbs
          },
          compilerOptions: {
            knownHelpers: {
              "ul": true
            }
          }
        },
        files: {
          "public/javascripts/templates.js": ["app/templates/*.hbs"]
        }
      }
    },
    watch: {
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['build', 'express:dev', 'watch'],
        options: {
          spawn: true,
        },
      },
      scripts: {
        files: ['app/**/*.js'],
        tasks: ['jshint:all', 'concat:app'],
        options: {
          spawn: true,
        },
      },
      express: {
        files: ['server.js', 'routes/index.js', 'io-routes/index.js'],
        tasks: ['jshint:server', 'express:dev'],
        options: {
          nospawn: true //Without this option specified express won't be reloaded
        }
      },
      css: {
        files: ['app/styles/*.styl'],
        tasks: ['stylus', 'concat:css'],
        options: {
          spawn: true,
        },
      },
      templates: {
        files: ['app/templates/*.hbs'],
        tasks: ['handlebars'],
        options: {
          spawn: true,
        },
      }
    },
    express: {
      options: {
        debug: true
        // Override defaults here
      },
      dev: {
        options: {
          script: 'server.js'
        }
      }
    },
    'node-inspector': {
      default: {}
    }
  });

  grunt.registerTask('build', [
    'bower:install',
    'jshint:server',
    'jshint:all',
    'stylus',
    'handlebars',
    'uglify',
    'cssmin',
    'copy'
  ]);

  grunt.registerTask('build-dev', [
    'bower:install',
    'jshint:server',
    'jshint:all',
    'stylus',
    'copy',
    'handlebars',
    'concat'
  ]);

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  grunt.registerTask('server', [ 'build-dev', 'express:dev', 'watch' ]);

  // Default task(s).
  grunt.registerTask('default', ['build']);

};
