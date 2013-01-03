module.exports = function(grunt) {
  grunt.initConfig({
    info: '<json:component.json>',
    meta: {
      banner: '/*!\n'+
              ' * <%= info.name %> - <%= info.description %>\n'+
              ' * v<%= info.version %>\n'+
              ' * <%= info.homepage %>\n'+
              ' * copyright <%= info.copyright %> <%= grunt.template.today("yyyy") %>\n'+
              ' * <%= info.license %> License\n'+
              '*/'
    },
    lint: {
      main: [
        'grunt.js', 
        'component.json',
        'lib/**/*.js',
        'test/*.js'
      ]
    },
    concat: {
      dist: {
        src: ['<banner>', 'lib/slider.js'],
        dest: 'dist/fidel.slider.js'
      }
    },
    min: {
      dist: {
        src: ['<banner>', 'dist/fidel.slider.js'],
        dest: 'dist/fidel.slider.min.js'
      }
    },
    watch: {
      main: {
        files: '<config:lint.main>',
        tasks: 'default' 
      },
      ci: {
        files: [
          '<config:lint.main>',
          'test/index.html'
        ],
        tasks: 'default mocha' 
      }
    },
    mocha: {
      all: {
        src: 'test/index.html',
        run: true
      }
    },
    reloadr: {
      test: [
        'test/*',
        'dist/*'
      ]
    },
    server:{
      port: 8000,
      base: '.'
    }
  });
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-reloadr');
  grunt.registerTask('default', 'lint concat min');
  grunt.registerTask('dev', 'server reloadr watch:main');
  grunt.registerTask('ci', 'watch:ci');
};
