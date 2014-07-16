/*
 * grunt-jst-i18n
 * https://github.com/morriswchris/grunt-jst-i18n
 * Copyright (c) 2014 Chris Morris
 * Licensed under the MIT license.
 */
var _ = require("lodash"),
	colors = require("colors"),
	path = require("path");

module.exports = function(grunt) {
	var i18n = require("./lib/i18n")(grunt),
		requiredOptions = [],
		translations = null,
		errors = false,
		options = null;

	grunt.registerMultiTask("i18n", "Extropalate templates into static localized resources", function() {
		//defaults
		options = this.options({
			templateSettings: {
				interpolate: /\<\%t(.+?)\%\>/g,
				evaluate: /\<\%\!t(.+?)\%\>/g
			},
			translations: ""
		});
		//check that we have required templates and translations directories
		_.forEach(requiredOptions, function(option) {
			grunt.verbose.writeln("Checking %s required option", option.cyan);
			if (_.isEmpty(options[option])) {
				grunt.log.error("The %s attribute must be specified in the grunt options", option.yellow);
				errors = true;
			}
		});

		//see if we had errors loading in the options
		if (errors) {
			grunt.fatal("Please double check your config settings.");
			return;
		}

		//build up the i18n object
		translations = i18n.getTranslations(options.translations);
		grunt.verbose.writeln("Got translations", translations);
		//process our i18n
		this.files.forEach(function(file) {
			grunt.verbose.writeln("file:", file);
			_.forEach(translations, function(data, lang) {
				var contents = file.src.filter(function(filepath) {
					// Remove nonexistent files (it's up to you to filter or warn here).
					if (!grunt.file.exists(filepath)) {
						grunt.log.warn("Source file %s not found.", filepath);
						return false;
					}
					else {
						return true;
					}
				}).map(function(filepath) {
					// Read and return the file's source.
					var content = grunt.file.read(filepath);
					return _.template(content, data, options.templateSettings);
				}).join('\n');
				// Write joined contents to destination filepath.
				var dest = file.dest.substr(0, file.dest.lastIndexOf("/")),
					fileName = file.dest.substr(file.dest.lastIndexOf("/"));
				grunt.file.write(dest + "/" + lang + "/" + fileName, contents);
				// Print a success message.
				grunt.log.writeln('File "' + file.dest + "/" + lang + '" created.');
			});
		});
	});
};