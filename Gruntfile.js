module.exports = function(grunt) {
	grunt.initConfig({
		i18n: {
			test: {
				options: {
					translations: "test/app/lang",
					templateSettings: {
						interpolate: /\<\%t(.+?)\%\>/g,
						evaluate: /\<\%\!t(.+?)\%\>/g
					}
				},
				files: [{
					expand: true,
					cwd: "test/app/templates",
					src: ["**/*.html"],
					dest: "test/build/i18n/"
				}]
			}
		},
		nodeunit: {
			all: ["test/*_test.js"]
		},
		clean: ["test/build/**/*"]
	});

	grunt.loadTasks("tasks");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.registerTask("default", ["i18n"]);
	grunt.registerTask("test", ["clean", "i18n:test", "nodeunit"]);
};