// dependencies
var debug = require('debug')('duo-handlebars');
var extend = require('extend');
var fs = require('co-fs');
var Handlebars = require('handlebars');
var runtimePath = require.resolve('handlebars/dist/handlebars.runtime.js');
var util = require('util');

// default config options
var defaults = {
  extension: 'hbs'
};

// template used for outputting the file to the duo builder
var format = [
  'var Handlebars = require("handlebars-runtime");',
  'module.exports = Handlebars.template(%s);'
].join('\n');


module.exports = function (opts) {
  var options = extend(true, {}, defaults, opts);
  debug('initialized with options', opts);

  // extract this option (the rest are given directly to Handlebars)
  var extension = options.extension;
  delete options.extension;

  return function *handlebars(file) {
    if (file.type !== extension) return;
    file.type = 'js';

    if (!file.included('handlebars-runtime')) {
      var runtime = yield fs.readFile(runtimePath, 'utf8');
      file.include('handlebars-runtime', runtime);
      debug('runtime added');
    }

    var tpl = Handlebars.precompile(file.src, options);
    debug('%s compiled', file.id);
    file.src = util.format(format, tpl);
  };
};
