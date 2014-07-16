/*
 * grunt-jst-i18n
 * https://github.com/morriswchris/grunt-jst-i18n
 * Copyright (c) 2014 Chris Morris
 * Licensed under the MIT license.
 */
var _ = require("lodash"),
	path = require("path");

module.exports = function(grunt) {
	var i18n = require("./lib/i18n")(grunt),
		translations = null,
		options = null,
		files = null;

	grunt.registerMultiTask("i18n", "Extropolate templates into static localized resources", function() {
		//defaults
		options = this.options({
			templateSettings: {
				interpolate: /\<\%t(.+?)\%\>/g,
				evaluate: /\<\%\!t(.+?)\%\>/g
			},
			translations: ""
		});

		files = this.files;

		//build up the i18n object
		translations = i18n.getTranslations(options.translations);
		grunt.verbose.writeln("Got translations", translations);

		//process our i18n
		_.forEach(translations, function(data, lang) {
			files.forEach(function(file) {
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
				grunt.log.writeln('File "' + dest + "/" + lang + "/" + fileName + '" created.');
			});
		});
	});
};