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
      all: ['lib/**/*.js', 'grunt.js', 'component.json']
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
      js: {
        files: '<config:lint.all>',
        tasks: 'default' 
      }
    },
    server:{
      port: 8000,
      base: '.'
    }
  });
  grunt.registerTask('default', 'lint concat min');
  grunt.registerTask('dev', 'server watch');
};
