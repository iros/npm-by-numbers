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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

};