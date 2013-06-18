/*
 * grunt-ejs-render
 * https://github.com/dwightjack/grunt-ejs-render
 *
 * Copyright (c) 2013 Marco Solazzi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	var ejs = require('ejs'),
		path = require('path'),
		fs = require('fs'),
		_ = grunt.util._;

	function render(filepath, options) {
		var src = '';

		if (grunt.file.exists(filepath)) {
			src = grunt.file.read(filepath);
			return ejs.render(src, options || null);
		} else {
			grunt.log.warn('File "' + filepath + '" not found.');
			return '';
		}
	}

	grunt.registerMultiTask('render', 'Renders an EJS template to plain HTML', function() {
		var options = this.options({
				helpers: {},
				//basePath: '', DEPRECATED
				templates: []
			}),
			datapath,
			templates = {},
			methods = {};

		//setup some default methods
		methods.template = function(tplName, data) {
			if (!_.has(templates, tplName)) {
				grunt.log.warn('Unable to find template "' + tplName + '"');
			} else {
				return templates[tplName](data);
			}
		};
		methods.getMTime = function(filepath) {
			var fpath = path.normalize(filepath);
				grunt.log.writeln(grunt.file.exists(fpath));
			if (grunt.file.exists(fpath)) {
				return fs.statSync(fpath).mtime.getTime();
			} else {
				grunt.log.warn('Unable to find filepath "' + filepath + '"');
				return '';
			}
		};

		//options.basePath = grunt.template.process(options.basePath);

		if (_.has(options, 'data') && _.isString(options.data)) {
			datapath = grunt.template.process(options.data);
			if (grunt.file.exists(datapath)) {
				options.data = grunt.file.readJSON(datapath);
			}
		}

		_.each(grunt.file.expand(options.templates), function(tpl) {
			var tplName = path.basename(tpl, path.extname(tpl)).replace(/[\s\-]/g, '_');
			templates[tplName] = _.template(grunt.file.read(tpl));
		});

		//add default methods if not already set
		options.helpers = _.defaults(options.helpers, methods);

		options._ = _;

		this.files.forEach(function(file) {
			var contents = file.src.map(function(filepath) {
				options.filename = filepath;
				return render(filepath, options);
			}).join('\n');

			// Write joined contents to destination filepath.
			grunt.file.write(file.dest, contents);
			// Print a success message.
			grunt.log.writeln('Rendered HTML file to "' + file.dest + '"');
		});
	});
};