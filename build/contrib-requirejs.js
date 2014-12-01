module.exports = function(grunt) {

  grunt.config.set('requirejs', {
    options: {
      baseUrl: '.',
      paths: {
        'modules': 'src/modules',
        'main': 'src/main'
      },
      mainConfigFile: 'src/requirejs/config.js',
      insertRequire: ['main'],
      name: 'bower_components/almond/almond',
      optimize: 'uglify2',
      generateSourceMaps: true,
      preserveLicenseComments: false,
    },

    web: {
      options: {
        out: 'prod/web.js',
        rawText: {
          'src/modules/mobile/core/router': 'define(function() {});'
        }
      }
    },

    mobile: {
      options: {
        out: 'prod/mobile.js',
        rawText: {
          'src/modules/web/core/router': 'define(function() {});'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');

};
