module.exports = function(grunt) {
	var _ = require("lodash"),
		i18n = {},
		translations = {},
		filePath = null;

	/**
	 * Build a nested object with indexes from a flat array
	 * @param  {Array} array The flat array to be used as keys in our object
	 * @param  {Number} index The current index of the array
	 * @return {Object}       The object created
	 */
	function createObject(array, index) {
		//reverse add, so start from the end
		if (array[index + 1]) {
			translations[array[index]] = _.extend({}, translations[array[index]], createObject(array, index + 1));
		}
		//we are at the end, load in our file for the object data
		else if (filePath) {
			var obj = {};
			obj[array[index]] = require("../../" + filePath);
			return obj;
		}
	}

	/**
	 * Recursively scan a language directory to return our i18n object of translations by locale
	 * @param  {String} dir Directory for grunt.file.recurse to read from
	 * @return {none}
	 */
	i18n.getTranslations = function(dir) {
		//get all of our lang objects into 1 nested object
		grunt.file.recurse(dir, function(absDir, rootDir, subDir, fileName) {
			//convert our subdir and file name into a nested obj
			if (subDir && fileName.substr(0, 1) !== ".") {
				var dir = subDir + "/" + fileName.split(".")[0],
					dirArray = dir.split("/"),
					currentObj = {};
				filePath = absDir;
				createObject(dirArray, 0);
			}
		});

		return translations;
	}

	return i18n;
};