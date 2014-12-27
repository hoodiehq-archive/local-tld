module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-semantic-release');

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js'],
      // files: ['Gruntfile.js', 'lib/**/*.js', 'bin/local-tld-service'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    release: {
      email: 'jan@apache.org',
      name:  'Jan Lehnardt'
    }
  });

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['test']);
};
