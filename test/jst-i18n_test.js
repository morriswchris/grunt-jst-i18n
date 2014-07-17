var grunt = require("grunt"),
	tests = {};

//scan all our built templates and build tests
grunt.file.recurse("test/build/i18n", function(absDir, rootDir, subDir, fileName) {
	tests[subDir + ":" + fileName] = function(test) {
		var actual = grunt.file.read(absDir),
			expected = grunt.file.read("test/expected/i18n/" + subDir + "/" + fileName);
		test.equal(actual, expected, "compare our sample file for translations");
		test.done();
	}
});
//return our tests
module.exports = tests;