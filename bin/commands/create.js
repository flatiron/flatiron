var common = require('broadway').common,
    mkdirp = common.mkdirp,
    directories = common.directories,
    path = require('path'),
    fs = require('fs');
  
var create = module.exports = function create(name) {
  name = name || 'flatiron-app';

  var createDirs = directories.normalize(process.cwd(), {
    config: '#ROOT/config',
    lib: '#ROOT/lib',
    commands: '#ROOT/lib/commands',
    test: '#ROOT/test'
  });
  
  directories.create(createDirs, function() {
    var pkg = {
      name: name,
      private: true,
      version: '0.0.0',
      dependencies: {
        flatiron: require('pkginfo', require('../../lib/flatiron'), 'version').version
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
      ' path = require(\'path\')',
      ' app = flatiron.app;',
      '',
      'app.use(flatiron.plugins.cli, {',
      '  dir: path.join(__dirname,\'lib\',\'commands\'),',
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
}
create.usage = [
  'create :appname - generate a flatiron skeleton application'
]