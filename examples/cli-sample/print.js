var print = module.exports = function print(msg) {
  this.tty.log(msg);
}
print.usage = 'Print out a <msg>';