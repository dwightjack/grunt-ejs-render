/*
 * grunt-ejs-render
 * https://github.com/dwightjack/grunt-ejs-render
 *
 * Copyright (c) 2013 Marco Solazzi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    render: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/default_options'],
        },
      },
      custom_options: {
        options: {
          templates: 'test/fixtures/templates/**/*.tpl',
          data: {
            fruits: [{name: 'orange'}, {name: 'apple'}, {name: 'lemon'}]
          }
        },
        files: {
          'tmp/custom_options': ['test/fixtures/custom_options'],
        },
      },
      data_filepaths: {
        options: {
          data: ['test/fixtures/data/*.json']
        },
        files: {
          'tmp/data_filepaths': ['test/fixtures/data_filepaths'],
        },
      },
      read_file_helper: {
        options: {
          partialPaths: ['test/fixtures/']
        },
        files: {
          'tmp/read_file_helper': ['test/fixtures/read_file_helper'],
        },
      },
      read_file_md_filter: {
        options: {
          partialPaths: ['test/fixtures/']
        },
        files: {
          'tmp/read_file_md_filter': ['test/fixtures/read_file_md_filter'],
        },
      },
      helpers_context: {
        options: {
          helpers: {
            getTestKey: function () {
              return this.data.testKey;
            }
          },
          data: {
            testKey: 'testValue'
          }
        },
        files: {
          'tmp/helpers_context': ['test/fixtures/helpers_context'],
        },
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'render', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
