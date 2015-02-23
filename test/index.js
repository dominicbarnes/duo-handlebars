var assert = require('assert');
var Duo = require('duo');
var fs = require('co-fs');
var handlebars = require('../');
var path = require('path');
var thunkify = require('thunkify');
var rm = thunkify(require('rimraf'));
var vm = require('vm');

var fixture = path.join.bind(path, __dirname, 'fixtures');

after(function* () {
  yield rm(fixture('components'));
});

describe('duo-handlebars', function () {
  it('should be a function', function () {
    assert(typeof handlebars === 'function');
  });

  it('should return a function', function () {
    assert(typeof handlebars() === 'function');
  });

  it('should compile handlebars templates', function* () {
    var root = fixture();

    var duo = new Duo(root)
      .use(handlebars())
      .entry('example.js');

    var js = yield duo.run();
    var tpl = evaluate(js).main;

    var actual = tpl({ name: 'World' });
    var expected = yield fs.readFile(fixture('example.html'), 'utf8');
    assert(actual === expected);
  });
});


function evaluate(js) {
  var ctx = { window: {}, document: {} };
  vm.runInNewContext('main =' + js + '(1)', ctx, 'main.vm');
  vm.runInNewContext('require =' + js + '', ctx, 'require.vm');
  return ctx;
}
