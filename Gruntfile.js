module.exports = function(grunt) {
  grunt.initConfig({
    info: grunt.file.readJSON('bower.json'),
    meta: {
      banner: '/*!\n'+
              ' * <%= info.name %> - <%= info.description %>\n'+
              ' * v<%= info.version %>\n'+
              ' * <%= info.homepage %>\n'+
              ' * copyright <%= info.copyright %> <%= grunt.template.today("yyyy") %>\n'+
              ' * <%= info.license %> License\n'+
              '*/\n'
    },
    jshint: {
      main: [
        'Gruntfile.js',
        'bower.json',
        'lib/**/*.js',
        'test/**/*test.js'
      ]
    },
    bower: {
      main: {
        dest: 'dist/_bower.js',
        exclude: [
          'blanket',
          'jquery',
          'assert'
        ]
      }
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: 'lib/slide.js',
        dest: 'dist/fidel.slide.js'
      },
      full: {
        src: [
          'dist/_bower.js',
          'lib/slide.js'
        ],
        dest: 'dist/slide.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: 'dist/fidel.slide.js',
        dest: 'dist/fidel.slide.min.js'
      },
      full: {
        src: 'dist/slide.js',
        dest: 'dist/slide.min.js'
      }
    },
    clean: {
      bower: [
        'dist/_bower.js'
      ],
      dist: [
        'dist'
      ]
    },
    watch: {
      scripts: {
        files: ['<%= jshint.main %>', 'lib/*.less'],
        tasks: 'scripts'
      },
      ci: {
        files: [
          'GruntFile.js',
          'test/index.html'
        ],
        tasks: 'default'
      }
    },
    mocha: {
      all: {
        src: 'test/index.html',
        options: {
          run: true,
          reporter: 'Spec'
        }
      }
    },
    plato: {
      main: {
        files: {
          'reports': ['lib/*.js']
        }
      }
    },
    connect: {
      server:{
        options: {
          port: 8000,
          directory: '.'
        }
      },
      plato: {
        options: {
          keepalive: true,
          port: 8000,
          base: 'reports'
        }
      }
    },
    bytesize: {
      scripts: {
        src: [
          'dist/*'
        ]
      }
    },
    less: {
      allTransitions: {
        src: 'lib/transitions.all.less',
        dest: 'dist/transitions.css'
      }
    },
    autoprefixer: {
      options: {

      },
      transitions: {
        src: 'dist/transitions.css'
      }
    }
  });
  require('load-grunt-tasks')(grunt);
  grunt.registerTask('scripts', ['jshint', 'bower', 'concat', 'uglify', 'clean:bower', 'less', 'autoprefixer', 'mocha', 'bytesize']);
  grunt.registerTask('default', ['scripts']);
  grunt.registerTask('dev', ['connect:server', 'watch']);
  grunt.registerTask('reports', ['plato', 'connect:plato']);
};
