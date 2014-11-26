module.exports = function(grunt) {

  grunt.config.set('copy', {
    prod: {
      expand: true,
      cwd: 'assets/img',
      src: '**/*',
      dest: 'prod/img',
    },
    data: {
      expand: true,
      cwd: 'assets/data',
      src: '**/*',
      dest: 'prod/data',
    },
    slickfonts: {
      expand: true,
      cwd: 'bower_components/slick.js/slick/fonts',
      src: '**/*',
      dest: 'prod/fonts'
    },
    slickloader: {
      expand: true,
      cwd: 'bower_components/slick.js/slick/',
      src: 'ajax-loader.gif',
      dest: 'prod'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

};