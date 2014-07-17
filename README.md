grunt-jst-i18n
==============

>Build time i18n of templates

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jst-i18n --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTask("grunt-jst-i18n");
```

## Methodology

With build steps becoming more popular to alleviate load, passing i18n off to a build step allows for a faster load of web resources. As a result, passing off the creation of our templates per locale to a build task should save development time and load time. This idea was conceived based on the usage of [grunt-processhtml](https://github.com/dciccale/grunt-processhtml/). This will allow us to build one template with i18n variables, and at the time of build have a static html file generated per locale supported. Optionally, you can then pass this directly to the [grunt-contrib-jst](https://github.com/gruntjs/grunt-contrib-jst) to force a  pre-compilation of all templates.

## Options
### files
Description: `Template files to be extrapolated into i18n files using the [node-glob](https://github.com/isaacs/node-glob) patterns`
Type: `Object`

### options.translations
Description: `Location of your language modules`
Type: `String`

### options.templateSettings
Description: `Optional object of [lodash supported template settings](http://lodash.com/docs#templateSettings)`
Type: `Array`
Default value: `{
				interpolate: /\<\%t(.+?)\%\>/g, //<%t %>
				evaluate: /\<\%\!t(.+?)\%\>/g  //<%!t %>
			}`


## Templating Process

Below is all the necessities to get you up and running with i18n templates

### Language Module

In order to facilitate translations, a required directory of namespaced translation modules must exist. The `i18n.options.translations` param will specify where to find the translation modules. Each language module follows the node `module.exports` convention.

#### Example module

```javascript
//location: app/lang/en_US/interpolate.js
module.exports = {
    heading: "this is a heading"
}

```

#### Example using en_US and fr_CA
```javascript
//the following tree of language modules
├── app
│   ├── lang
│   │   ├── en_US
│   │   │   ├── evaluate.js
│   │   │   └── interpolate.js
│   │   └── fr_CA
│   │       ├── evaluate.js
│   │       └── interpolate.js

//produces this i18n object for templating data
var i18n = {
	en_US: {
		//contents of app/lang/en_US/evaluate.js
		evaluate: {
			heading: "this is a heading"
		},
		//contents of app/lang/en_US/interpolate.js
		interpolate: {
			names: ["name1", "name2"]
		}
	},
	fr_CA: {
		//contents of app/lang/fr_CA/evaluate.js
		evaluate: {
			heading: "Ca c'est un title"
		},
		//contents of app/lang/fr_CA/interpolate.js
		interpolate: {
			names: ["nom1", "nom2"]
		}
	}
}
```

We will then pass each of the locale indexes to our _.template function to be applied against our templates.

### Templating Interpolation and Evaluation

With any front end templating language, there are two ways of processing the dynamic data: interpolation and evaluation. Interpolation (interpolate) is the character delimiter set used to print or echo out the result being asked. This is similar to server side templating where we wish to print a variable value only (like the <?= ?> in php ). Evaluation (evaluate) is the character delimiter used to perform a full execution of statements. This setting allows us to execute statements within markup, without printing anything. Below are example conventions for both interpolation and evaluation with the underscore/lodash templating engine.

``` javascript
//Define our interpolate and evaluate regex
_.templateSettings.interpolate = /\<\%t(.+?)\%\>/g; //<%t %>
_.templateSettings.evaluate = /\<\%\!t(.+?)\%\>/g;  //<%!t %>

// using the "interpolate" delimiter to create a compiled template
var compiled = _.template('hello <%t name %>');
compiled({ 'name': 'fred' });
// ? 'hello fred'

// using the "evaluate" delimiter to generate HTML
var list = '<%!t _.forEach(people, function(name) { %><li><%t name %></li><% }); %>';
_.template(list, { 'people': ['fred', 'barney'] });
// ? '<li>fred</li><li>barney</li>'

// using the internal `print` function in "evaluate" delimiters
_.template('<%!t print("hello " + name); %>!', { 'name': 'barney' });
// ? 'hello barney!'

```



#### Example Template with localization (based on above locale modules)

``` html
<!-- tpl:sample.html -->
<h3><%t interpolate.heading %></h3>
<input type="checkbox" value="<%= toggle.val %>" />
<%!t for(var i=1; i<evaluate.names.length; i++){ %>
<label><%t evaluate.names[i] %></label>
<%!t } %>

<!-- i18n/en_US tpl:sample.html -->
<h3>this is a heading</h3>
<input type="checkbox" value="<%= toggle.val %>" />
<label>name1</label>
<label>name2</label>

<!--
Notice how the line '<%= toggle.val %>' is the only line to not render. This is because it does not follow the i18n interpolation and evaluation rules. As a result, we are still able to build our template interchangeably though localization and dynamic template data.
-->
```