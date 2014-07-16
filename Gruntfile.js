module.exports = function(grunt) {
	grunt.initConfig({
		i18n: {
			dist: {
				options: {
					translations: "test/app/lang"
				},
				files: [{
					expand: true,
					cwd: "test/app/templates",
					src: ["**/*.html"],
					dest: "test/build/i18n/"
				}]
			}
		}
	});

	grunt.loadTasks("tasks");
	grunt.registerTask("default", ["i18n"]);
};