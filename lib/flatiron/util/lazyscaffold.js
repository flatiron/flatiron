var fs = require('fs'),
  path = require('path');
  
function LazyScaffold(dir) {
  this.dir = dir;
  this.modules = {};
}
module.exports = LazyScaffold;

LazyScaffold.prototype.list = function list(target, callback) {
  return fs.readdir(path.join(this.dir,path.normalize(target)), callback);
}
LazyScaffold.prototype.listSync = function listSync(target) {
  return fs.readdirSync(path.join(this.dir,path.normalize(target)));
}
LazyScaffold.prototype.getSync = function getSync(target) {
  target = path.normalize(target);
  if(this.modules[target]) {
    return this.modules[target];  
  };
  return this.modules[target] = path.join(this.dir,path.normalize(target));
}
//
// Recurse UP the target until we find a module, can filter when looking for things
//
LazyScaffold.prototype.recurseSync = function resurceSync(target, filter) {
  target = path.normalize(target);
  if (this.modules[target]) {
    return this.modules[target];
  }
  var module;
  while (!module || target !== '.') {
    try {
      var modulePath = path.join(this.dir, target);
      var moduleStat = fs.statSync(modulePath);
      if (moduleStat.isDirectory()) {
        continue;
      }
      module = require(modulePath);
      if (filter && !filter(moduleStat, path)) {
        module = undefined;
      }
    }
    catch (err) {
      target = path.dirname(target);
    }
  }
  return module;
}