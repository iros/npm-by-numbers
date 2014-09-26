module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  });

  // Load Grunt plugins.
  grunt.loadTasks('build');

  // Tasks.
  grunt.registerTask('setup-dev',
    'Prepare development environment',
    ['jshint', 'clean:prod', 'copy', 'jade:dev', 'stylus:dev', 'connect:dev']);

  grunt.registerTask('dev',
    'Compile and start a dev webserver.',
    ['setup-dev', 'watch']);

  grunt.registerTask('prod-build',
    'Build production',
    ['clean:prod', 'jade:prod', 'stylus:prod', 'copy', 'requirejs']);

  grunt.registerTask('prod',
    'Compile for production and start a test webserver.',
    [ 'prod-build', 'connect:prod']);

  grunt.registerTask('deploy',
    'Compile for production and deploy to s3',
    ['prod-build', 's3']);

  grunt.registerTask('default', ['dev']);

};