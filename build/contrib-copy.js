module.exports = function(grunt) {

  grunt.config.set('copy', {
    prod: {
      expand: true,
      cwd: 'assets/img',
      src: '**/*',
      dest: 'prod/img',
    },
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

};