# duo-handlebars

> A [Handlebars](http://handlebarsjs.com/) plugin for Duo

## Install

```sh
$ npm install --save duo-handlebars
```

## Usage

### CLI

```sh
$ duo --use duo-handlebars
```

### API

```js
var Duo = require('duo');
var handlebars = require('duo-handlebars');

var duo = Duo(__dirname)
    .entry('index.js') // JS file that requires a .hbs template
    .use(handlebars());

duo.run(function (err, file) {
    if (err) throw err;
    // file => will include compiled handlebars templates
});
```

## Options

Whatever options are passed (other than `extension`) will be proxied directly to `Handlebars.precompile()`

### extension

Determines what file extension to interpret handlebars templates as. (the default is `"hbs"`)
