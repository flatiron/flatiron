var fs = require('fs'),
    path = require('path'),
    inflect = require('node-inflect'),
    flatiron = require('../../flatiron'),
    common = flatiron.common,
    app = flatiron.app;

module.exports = function generate(/* arguments */) {
  var callback = arguments[arguments.length - 1];
  delete arguments[arguments.length - 1];

  var displayHelp = false;
  var root = process.cwd(),
      scaffold = path.join(__dirname, '..', '..', '..', 'scaffolds', 'http'),
      generator = path.join(scaffold, 'generators');

  if (arguments.length > 1) {
    if (arguments[0] == 'help') {
      if (module.exports.help[arguments[1]]) {
        module.exports.writeHelp(arguments[1]);
      } else {
        displayHelp = true;
      }
    } else if (common.isAppRoot(root)) {
      var target = common.directories.normalize(root, flatiron.constants.DIRECTORIES);
      var files = [];

      switch(arguments[0]) {
        case 'assets':
          if (arguments.length > 1) {
            var name = module.exports.inflect(arguments[1]);
            files.push({
              src: 'asset.css',
              path: path.join(target.stylesheets, name.underscorepluralized + '.css'),
              name: name
            });
            files.push({
              src: 'asset.js',
              path: path.join(target.javascripts, name.underscorepluralized + '.js'),
              name: name
            });
          } else {
            module.exports.writeHelp(arguments[0]);
          }
          break;
        case 'presenter':
          if (arguments.length > 1) {
            var name = module.exports.inflect(arguments[1]);
            delete arguments[0];
            delete arguments[1];

            var viewDir = path.join(target.views, name.underscorepluralized);
            app.log.info('Creating directory ' + viewDir.slice(root.length + 1).grey);
            if (!path.existsSync(viewDir)) {
              fs.mkdirSync(viewDir, '0755');
            }

            files.push({
              src: 'presenter.js',
              path: path.join(target.presenters, name.underscorepluralized + '.js'),
              name: name
            });

            for (var key in arguments) {
              files.push({
                src: 'view.html',
                name: arguments[key],
                path: path.join(target.views, name.underscorepluralized, arguments[key] + '.html')
              });
            }
          } else {
            module.exports.writeHelp(arguments[0]);
          }
          break;
        default:
          displayHelp = true;
          break;
      }

      if (files.length != 0) {
        module.exports.writeFiles(generator, root, files, callback);
      }
    } else {
      displayHelp = true;
    }
  } else {
    displayHelp = true;
  }

  if (displayHelp) {
    module.exports.writeHelp('usage');
    callback();
  }
}

module.exports.writeFiles = function (source, root, files, next) {
  var inflections = flatiron.constants.INFLECTIONS;

  var copyFile = function (file, nextFile) {
    fs.readFile(path.join(source, file.src), function (err, data) {
      if (err) nextFile(err);

      data = data.toString('utf8');
      data = data.gsub('#NAME', file.name.name || file.name);
      data = data.gsub('#PATH', file.path.slice(root.length + 1));

      Object.keys(inflections).forEach(function (key) {
        data = data.gsub(inflections[key], file.name[key]);
      });

      app.log.info('Writing file ' + file.path.slice(root.length + 1).grey);
      fs.writeFile(file.path, data, nextFile);
    });
  }

  common.async.forEachSeries(files, copyFile, next);
}

module.exports.inflect = function (name) {
  return {
    'name': name,
    'underscoresingularized': inflect.singularize(inflect.underscore(name)),
    'underscorepluralized': inflect.tableize(name),
    'camelizesingularized': inflect.classify(name),
    'camlizepluralized': inflect.camelize(inflect.pluralize(name)),
  };
}

module.exports.writeHelp = function (name) {
  module.exports.help[name].forEach(function (e) {
    app.log.help(e);
  });
};

module.exports.help = {};

module.exports.usage = module.exports.help['usage'] = [
  'Generates code for flatiron HTTP application. If no <type>',
  'is specified, help is displayed. Should be run from the root',
  'directory of an app.',
  '',
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
