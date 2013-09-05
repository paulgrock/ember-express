/*global module:false*/
module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    shaSub: function(sha){
      return sha.substring(sha.length - 7);
    },
    jsDir: "public/javascripts",
    stylesDir: "public/stylesheets",
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['<%= jsDir %>/**/*.js', '!<%= jsDir %>/vendor/*.js']
    },
    compass: {
      options: {
        httpPath: '/',
        cssDir: '<%= stylesDir %>',
        sassDir: '<%= stylesDir %>',
        fontsDir: '<%= stylesDir %>/fonts',
        imagesDir: 'public/images',
        javascriptsDir: '<%= jsDir %>',
        noLineComments: true,
        sassOptions: {
          debugInfo: false,
          sourcemap: true
        },
        relativeAssets: true
      },
      dev: {
        outputStyle: 'nested'
      },
      prod: {
        cssDir: 'public/<%= shaSub(commitSHA) %>/styles',
        environment: 'production',
        outputStyle: 'compressed'
      }
    },
    express: {
      options: {
        script: 'app.js'
      },
      dev: {
        options: {
          debug: true,
          node_env: 'dev'
        }
      }
    },
    watch: {
      options: {
        livereload: true,
        spawn: false //Without this option specified express won't be reloaded
      },
      styles: {
        files: ['public/**/*.sass', 'public/**/*.scss'],
        tasks: ['compass:dev'],
      },
      src: {
        files: ['views/*.jade', '<%= jsDir %>/**/*.js', '!node_modules/**/*.js'],
      },
      server: {
        files: ['**/*.js', '!<%= jsDir %>/**/*.js', '!node_modules/**/*.js'],
        tasks: ['express:dev']
      }
    },
    imagemin: {
      options: {
        optimizationLevel: 3
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'public/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: 'public/images'
        }]
      }
    },
    'git-describe':  {
      options: {
        prop: 'commitSHA',
        dirtyMark: ''
      },
      target: {
      }
    },
    sftp: {
      options: {
      },
      createDirs: {
        files: {
          './': '<%= requirejs.prod.options.dir %>/**/*.js'
        }
      },
      js: {
        options: {
          createDirectories: false,
        },
        files: {
          './': '<%= requirejs.prod.options.dir %>/**/*.js'
        }
      },
      css: {
        files: {
          './': '<%= compass.prod.options.cssDir %>/**/*.css'
        }
      }
    },
    bower: {
      target: {
        rjsConfig: '<%= jsDir %>/common.js',
        exclude: [ 'modernizr', 'handlebars.runtime' ]
      }
    },
    requirejs: {
      options: {
        modules: [
          //First set up the common build layer.
          {
            name: 'common'
          }
        ],
        optimize: 'uglify2',
        preserveLicenseComments: false,
        optimizeCss: 'none',
        skipDirOptimize: true,
        fileExclusionRegExp: /^\./,
        commit: '<%= shaSub(commitSHA) %>',
        mainConfigFile: '<%= jsDir %>/common.js'
      },
      prod: {
        options: {
          appDir: '<%= jsDir %>',
          dir: 'public/<%= shaSub(commitSHA) %>/scripts',
          baseUrl: './'
        }
      }
    },
    plato : {
      main : {
        src : [ '**/*.js', '!<%= jsDir %>/vendor/**/*.js' ],
        dest : 'reports'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', [
    'jshint',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('local-build', [
    'git-describe',
    'compass:prod',
    'requirejs:prod'
  ]);

  grunt.registerTask('build', [
    'git-describe',
    'requirejs:prod',
    'compass:prod',
    'sftp'
  ]);

  grunt.registerTask('server', [
    'express:dev', 'watch'
  ]);
};
