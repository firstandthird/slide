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
        src: 'lib/slider.js',
        dest: 'dist/fidel.slider.js'
      },
      full: {
        src: [
          'dist/_bower.js',
          'lib/slider.js'
        ],
        dest: 'dist/slider.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: 'dist/fidel.slider.js',
        dest: 'dist/fidel.slider.min.js'
      },
      full: {
        src: 'dist/slider.js',
        dest: 'dist/slider.min.js'
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
        files: '<%= jshint.main %>',
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
          run: true
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
    reloadr: {
      main: [
        'example/*',
        'dist/*'
      ]
    },
    connect: {
      server:{
        port: 8000,
        base: '.'
      },
      plato: {
        port: 8000,
        base: 'reports',
        options: {
          keepalive: true
        }
      }
    },
    bytesize: {
      scripts: {
        src: [
          'dist/*'
        ]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-concat-bower');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-bytesize');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-reloadr');
  grunt.loadNpmTasks('grunt-plato');
  grunt.registerTask('scripts', ['jshint', 'bower', 'concat', 'uglify', 'clean:bower', 'mocha', 'bytesize']);
  grunt.registerTask('default', ['scripts']);
  grunt.registerTask('dev', ['connect:server', 'reloadr', 'watch']);
  grunt.registerTask('reports', ['plato', 'connect:plato']);
};
