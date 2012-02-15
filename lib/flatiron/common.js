/*
 * common.js: Common utility functions for flatiron.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var path = require('path');
var broadway = require('broadway');

//
// Hoist `broadway.common` to `flatiron.common`.
//
var common = module.exports = broadway.common.mixin({}, broadway.common);

//
// Files object
//
common.files = {
  create: function (src, dest, files, next) {

    function copyFile(file, nextFile) {
      common.cpr(path.join(src, file), path.join(dest, file), nextFile);
    }

    common.async.forEachSeries(files, copyFile, next);
  }
};

common.dirs = {
  create: function (dest, dirs, next) {

    function createDir(dir, nextDir) {
      common.mkdirp(path.join(dest, dir), 0755, nextDir);
    }

    common.async.forEachSeries(dirs, createDir, next);
  }
}

//
// ### function isAppRoot (path, type)
// Checks if the given path is the root dir of an app
//
common.isAppRoot = function (cwd, type) {
  type = type || 'http';

  if (type == 'http') {
    return path.existsSync(path.join(cwd, 'app.js'))
        && path.existsSync(path.join(cwd, 'app'))
        && path.existsSync(path.join(cwd, 'app/assets'))
        && path.existsSync(path.join(cwd, 'app/views'))
        && path.existsSync(path.join(cwd, 'app/resources'))
        && path.existsSync(path.join(cwd, 'app/presenters'));
  } else if (type == 'cli') {
    return path.existsSync(path.join(cwd, 'app.js'))
        && path.existsSync(path.join(cwd, 'config'))
        && path.existsSync(path.join(cwd, 'lib'))
        && path.existsSync(path.join(cwd, 'commands'));
  } else {
    return false;
  }
}

//
// ### function templateUsage (app, commands)
// Updates the references to `<app>` to `app.name` in usage for the
// specified `commands`.
//
common.templateUsage = function (app, commands) {
  if (!app.name) {
    return commands;
  }

  function templateUsage(usage) {
    return usage.map(function (line) {
      return line.replace(/\<app\>/ig, app.name);
    });
  }

  Object.keys(commands).forEach(function (command) {
    if (command === 'usage') {
      commands.usage = templateUsage(commands.usage);
    }
    else if (commands[command].usage) {
      commands[command].usage = templateUsage(commands[command].usage);
    }
  });
};
