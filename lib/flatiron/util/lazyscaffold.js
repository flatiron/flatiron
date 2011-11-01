var fs = require('fs'),
  path = require('path');
  
function LazyScaffold(dir) {
  this.dir = dir;
  this.modules = {};
}
module.exports = LazyScaffold;

LazyScaffold.prototype.list = function(target, callback) {
  return fs.readdir(path.join(this.dir,path.normalize(target)), callback);
}
LazyScaffold.prototype.listSync = function(target) {
  return fs.readdirSync(path.join(this.dir,path.normalize(target)));
}
LazyScaffold.prototype.getSync = function(target) {
  target = path.normalize(target);
  if(this.modules[target]) {
    return this.modules[target];  
  };
  return this.modules[target] = path.join(this.dir,path.normalize(target));
}