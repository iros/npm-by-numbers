module.exports = function(grunt) {

  grunt.config.set('requirejs', {
    prod: {
      options: {
        baseUrl: '.',
        paths: {
          'modules': 'src/modules',
          'main': 'src/main'
        },
        mainConfigFile: 'src/requirejs/config.js',
        insertRequire: ['main'],
        name: 'bower_components/almond/almond',
        out: 'prod/app.js',
        optimize: 'uglify2',
        generateSourceMaps: true,
        preserveLicenseComments: false,
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');

};
