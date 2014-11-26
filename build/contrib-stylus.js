module.exports = function(grunt) {

  grunt.config.set('stylus', {
    options: {
      import: ['nib', 'shared'],
      paths: ['src/modules/shared/styles', 'src/modules/web/styles', 'src/modules/mobile/styles'],
    },
    dev: {
      options: {
        compress: false,
      },
      src: [
        'bower_components/slick.js/slick/slick.css',
        'src/modules/shared/styles/app.styl',
        'src/modules/shared/**/*.styl',
        'src/modules/web/**/*.styl',
        'src/modules/mobile/**/*.styl'
      ],
      dest: 'prod/app.css',
    },
    prod: {
      src: '<%= stylus.dev.src %>',
      dest: '<%= stylus.dev.dest %>',
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');

};