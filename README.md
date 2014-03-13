# grunt-ejs-render

> Render ejs templates with custom data and helpers

This plugin provides ejs static rendering to enhance static file development.

Aside from default [ejs features](https://github.com/visionmedia/ejs#features) it provides:

* Lo-Dash/underscore functions (http://lodash.com/docs)
* Lo-Dash/underscore templates powered view partials (http://lodash.com/docs#template)
* markdown parsing via a custom ejs filter
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
    }
  }
})
```

### Options

#### options._
Type: `Object`
Default value: `_`

A reference to a [Lo-Dash](http://lodash.com) build. Defaults to the full [Lo-Dash](http://lodash.com) from npm integrated with [Underscore.string](https://github.com/epeli/underscore.string).


```js

//load a Backbone build of Lo-Dash
var bb_ = require('./customlibs/lodash/lodash-backbone.js');

grunt.initConfig({
  render: {
    options: {
     '_' : bb_ 
    }
    //...
  }
})
```



Inside a template you may access Lo-Dash functions from `_`:

```
<p><%= _.first(['orange', 'lemon', 'apple']) %></p>
<!-- outputs <p>orange</p> -->
```


#### options.data
Type: `Object|Array`
Default value: `null`

An object containing dynamic data to be passed to templates. 

You may also pass an array of JSON filepaths (any Grunt compatible globbing and template syntax is supported). `options.data` will be populated with files' contents.

```js
grunt.initConfig({
  render: {
    first_target: {
      data: ['path/to/my-file.json', 'path/to/my-other-file.json']
    },
    second_target: {
      data: { 'prop': 'my test'}
    }
  }
})
```

To access datas from inside a template use `data.` namespace:

```
<p><%= data.prop %></p>
```

When filepaths are provided, filenames are processed to create new namespaces:

```
<!-- read from path/to/my-file.json -->
<p><%= data.myFile.whatever %></p>

<!-- read from path/to/my-other-file.json -->
<p><%= data.myOtherFile.whateveragain %></p>
```


#### options.templates
Type: `Mixed`
Default value: `[]`

An [array of files](http://gruntjs.com/configuring-tasks#files) of [Lo-Dash templates](http://lodash.com/docs#template) to be used inside a main template file. May be useful to reuse client side templates to render a static file.

Compiled templates will be indexed by their filename without extension, and are accessible with the `helpers.template` helper method

Template configuration

```js
grunt.initConfig({
  render: {
    options: {
      templates: ['templates/*.tpl']
    }
  }
})
```

Usage

```
<!-- templates/list.tpl -->

<% fruits.forEach(function (fruit) { %>
  <li><%= fruit %></li>
<% }); %>
```

```
<!-- main.html -->

<p><%= helpers.template('list', {fruits: ['orange', 'lemon', 'apple']}) %></p>
```

#### options.partialPaths
Type: `Array`
Default value: `[]`

An array of paths where partials may be stored. Accepts both absolute and relative paths.  
Relative paths are resolved from `Gruntfile.js` location.

This option is used by the `getMTime` and `readPartial` helpers.

```js
grunt.initConfig({
  render: {
    options: {
      partialPaths: ['app/includes/']
    }
  }
});
```

```
<!-- includes app/includes/block.html -->
<div><%- helpers.readPartial('block.html') %></div>
```


#### options.helpers
Type: `Object`
Default value: `{}`

Hash of custom methods for usage inside a template. Within helpers, `this` refers to the current tasks' options.

Default helpers are:

* `template('templatename', dataObject)`: executes a precompiled Lo-Dash template (if available) with provided data object
* `getMTime('filepath')`: returns the last modified time (as unix timestamp) of the passed in file.
* `readPartial('filepath')`: includes the content of the passed in file.
* `renderPartial('filepath', dataObject)`: renders passed in template, properties of `dataObject` are available as template local variables.

Helpers configuration

```js
grunt.initConfig({
  render: {
    helpers: {
      //set a custom helper
      timestamp: function () { return new Date().getTime(); },
      getName: function () { return this.data.name; }
    },
    data: {
      name: 'John'
    }
  }
})
```

Usage inside templates

```
<!-- cache bursting -->
<script src="/lib/script.js?v=<%= helpers.getMTime('/lib/script.js') %>"></script>

<!-- lo dash template -->
<%= helpers.template('list', {fruits: ['orange', 'lemon', 'apple']}) %>

<!-- custom helper -->
build timestamp: <%= helpers.timestamp() %>

<!-- task's options within helpers  -->
Hi <%= helpers.getName() %>
<-- outputs: Hi John -->
```

### Custom ejs Filter

The plugin adds the `md` custom filter to ejs, which leverages [marked](https://github.com/chjj/marked) to parse markdown syntax:

```
<%-: **markdown rocks!** | md %>
<!-- prints <p><strong>markdown rocks!</strong></p>-->
```

You may use this filter in conjunction with `readPartial` helpers to import markdown files

```
<%-: helpers.readPartial('md/about-us.md') | md %>
```

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
You may provide custom options:

```js
grunt.initConfig({
  render: {
    options: {
      data: ['data/fruits.json']
      helpers: {
        timestamp: function () { return new Date().getTime(); }
      },
      templates: ['templates/*.tpl']
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

0.2.4 - merged [PR](https://github.com/dwightjack/grunt-ejs-render/pull/5)

0.2.4 - added `renderPartial` helper (thanks to [Piotr Walczyszyn](https://github.com/pwalczyszyn))

0.2.3 - Bound helpers context to current task's options

0.2.2 - Improved `options.data` option by adding filepaths processing

0.2.1 - Replaced deprecated reference to `grunt.util._` with `lodash` and `uderscore.string` npm modules

0.2.0 - Added `readPartial` helper, `partialPaths` option and `md` custom filter

0.1.1 - Better Docs

0.1.0 - Initial release
