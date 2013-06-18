# grunt-ejs-render

> Render ejs templates with custom data and helpers

This plugin provides ejs static rendering to enhance static file development.

Aside from default [ejs features](https://github.com/visionmedia/ejs#features) it provides:

* lo-dash/underscore functions (http://lodash.com/docs)
* lo-dash/underscore templates powered view partials (http://lodash.com/docs#template)
* an easy way to define custom _per task_ helpers 

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ejs-render --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ejs-render');
```

## The "render" task

### Overview
In your project's Gruntfile, add a section named `render` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  render: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.data
Type: `Object`
Default value: `null`

An object containing dynamic data to be passed to templates.  
To access datas from inside a template use `data.` namespace:

```html
<p><%= data.prop %></p>
```


#### options.templates
Type: `Mixed`
Default value: `[]`

An [array of files](http://gruntjs.com/configuring-tasks#files) of [lo-dash templates](http://lodash.com/docs#template) to be used inside a main template file. May be useful to reuse client side templates to render static files placeholders.

Compiled templates will be indexed by their filename without extension, and are accessible with the `helpers.template` helper method:

```html
<!-- templates/list.tpl -->

<% fruits.forEach(function (fruit) { %>
  <li><%= fruit %></li>
<% }); %>
```

```html
<!-- main.html -->

<p><%= helpers.template('list', {fruits: ['orange', 'lemon', 'apple']}) %></p>
```

#### options.helpers
Type: `Object`
Default value: `{}`

Hash of custom methods for usage inside a template.

Default helpers are:

* `template('templatename', dataObject)`: executes a precompiled lo-dash template (if available) with provided data object
* `getMTime('filepath')`: returns the last modified time (as unix timestamp) of the passed in file. `filepath` is relative to `Gruntfile.js`



### Usage Examples

#### Default Options
To process a file with ejs just pass it to the `files` array:

```js
grunt.initConfig({
  render: {
    options: {},
    files: {
      'dest/index.html': ['src/index.html']
    }
  }
});
```

#### Custom Options
You may provide custom data from a JSON file:

```js
grunt.initConfig({
  render: {
    options: {
      data: grunt.file.readJSON('data/fruits.json')
    },
    files: {
      'dest/fruits.html': ['src/fruits.html']
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History


0.1.0 - Initial release
