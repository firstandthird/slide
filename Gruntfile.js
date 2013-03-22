module.exports = function(grunt) {
  grunt.initConfig({
    info: grunt.file.readJSON('component.json'),
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
        'grunt.js', 
        'component.json',
        'lib/**/*.js',
        'test/*.js'
      ]
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: 'lib/slider.js',
        dest: 'dist/fidel.slider.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: 'dist/fidel.slider.js',
        dest: 'dist/fidel.slider.min.js'
      }
    },
    watch: {
      main: {
        files: '<%= jshint.main %>',
        tasks: 'default' 
      },
      ci: {
        files: [
          '<%= jshint.main %>',
          'test/index.html'
        ],
        tasks: ['default', 'mocha']
      }
    },
    mocha: {
      all: {
        src: 'test/index.html',
        options: {
          //grep: 'auto'
        }
        //run: true
      }
    },
    reloadr: {
      test: [
        'test/*',
        'dist/*'
      ]
    },
    connect: {
      server:{
        port: 8000,
        base: '.'
      }
    }
  });
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-reloadr');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('dev', ['connect', 'reloadr', 'watch:main']);
  grunt.registerTask('ci', ['connect', 'watch:ci']);
};
