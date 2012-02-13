var fs = require('fs'),
    path = require('path'),
    flatiron = require('../../flatiron'),
    common = flatiron.common,
    async = common.async,
    directories = common.directories,
    cpr = common.cpr,
    app = flatiron.app;

module.exports = function generate(/* arguments */) {
  var callback = arguments[arguments.length - 1];

  var root = process.cwd(),
      scaffold = path.join(__dirname, '..', '..', '..', 'scaffolds', 'http');

  if (arguments.length > 1) {
    var name = arguments[0];
    switch(name) {
      case 'help':
        if (module.exports.help[arguments[1]]) {
          module.exports.help[arguments[1]].forEach(function (e) {
            app.log.help(e);
          });
        }
        break;
      default:
        break;
    }
  } else {
    module.exports.usage.forEach(function (e) {
      app.log.help(e);
    });
  }
}

module.exports.usage = [
  'Generates code for flatiron HTTP application. If no <type>',
  'is specified, help is displayed.',
  '',
  'g <type> <args>',
  'generate <type> <args>',
  '',
  'TYPES:',
  '  assets',
  '  presenter',
  '  resource',
  '  scaffold',
  '',
  'For more detailed help on each type of generator',
  '',
  'generate help <type>'
];

module.exports.help = {};

module.exports.help['assets'] = [
  'Creates new assets in the application. Pass the asset name,',
  'either CamelCased or under_scored.',
  '',
  'generate assets <name>',
  '',
  'Example: `flatiron generate assets posts`',
  '',
  '  Javascript: app/assets/javascripts/posts.js',
  '  Stylesheet: app/assets/stylesheets/posts.css'
];

module.exports.help['presenter'] = [
  'Creates a new presenter and its views. Pass the presenter name, either',
  'CamelCased or under_scored, and a list of views as arguments',
  '',
  'generate presenter <name> <action ..>',
  '',
  'Example: `flatiron generate presenter CreditCard open debit credit close',
  '',
  '  Presenter: app/presenters/credit_cards.js',
  '  Views:     app/views/credit_cards/open.html [...]',
];

module.exports.help['resource'] = [
  'Creates a new resource in the application. Pass the resource name',
  'in singular form, either CamelCased or under_scored, and a list of properties',
  '',
  'generate resource <name> <field:type ..>',
  '',
  'Example: `flatiron generate resource User name age:number emails:array active:bool`',
  '',
  '  Resource: app/resources/user.js'
];

module.exports.help['scaffold'] = [
  'Scaffolds an entire REST api, from resource to presenter and views',
  'along with a full test suite. This is ready to use as a starting point',
  'for your RESTful application',
  '',
  'generate scaffold <name> <field:type ..>',
  '',
  'Example: `flatiron generate scaffold Post title body published:bool`',
  '',
  '  Javascript: app/assets/javascripts/posts.js',
  '  Stylesheet: app/assets/stylesheets/posts.js',
  '  Presenter:  app/presenters/posts.js',
  '  Resource:   app/resource/post.js',
  '  Views:      app/views/posts/index.html [create, show, edit, update, destroy]',
];
