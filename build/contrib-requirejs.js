module.exports = function(grunt) {

  grunt.config.set('requirejs', {
    prod: {
      options: {
        baseUrl: '.',
        paths: {
          'modules': 'src/modules',
          'main': 'src/main'
        },
        include: [
          'modules/web/requirejs/config',
          'modules/mobile/requirejs/config',
          'backbone',
          'modules/web/core/router',
          'modules/mobile/core/router'
        ],
        mainConfigFile: 'src/requirejs/config.js',
        insertRequire: ['main'],
        name: 'bower_components/almond/almond',
        out: 'prod/app.js',
        optimize: 'none',
        generateSourceMaps: true,
        preserveLicenseComments: false,
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');

};