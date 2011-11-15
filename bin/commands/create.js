var mkdirp = require('mkdirp'),
  path = require('path'),
  fs = require('fs');
  
var create = module.exports = function create(name) {
  name = name || 'flatiron-app';
  mkdirp('config', '0755', function() {
    mkdirp('lib/commands', '0755', function () {
      mkdirp('lib', '0755', function() {
        mkdirp('test', '0755', function() {
          var pkg = {
            name: name,
            private: true,
            version: '0.0.0',
            dependencies: {
              flatiron: JSON.parse(fs.readFileSync(__dirname + '/../../package.json', 'utf8')).version
            },
            devDependencies: {
              vows: '0.5.x'
            },
            scripts: {
              test: 'vows test',
              start: 'node app.js'
            }
          }
          
          var template = [
            'var flatiron = require(\'flatiron\'),',
            ' path = require(\'path\'),',
            ' app = flatiron.app;',
            '',
            'app.use(flatiron.plugins.cli, {',
            '  dir: path.join(__dirname,\'..\',\'lib\',\'commands\'),',
            '  usage: \'Empty Flatiron Application, please fill out commands\'',
            '});',
            '',
            'if (require.main === module) {',
            '  app.init(function () {',
            '    app.start();',
            '  });',
            '}'
          ].join('\n') + '\n';
          
          fs.writeFile('package.json', JSON.stringify(pkg, null, ' ') + '\n');
          fs.writeFile('app.js', template);
          fs.writeFile(path.join('lib', name + '.js'), '');
        });
      });
    });
  });
}
create.usage = [
  'create :appname - generate a flatiron skeleton application'
]