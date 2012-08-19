// Socket.io configuration for Flatiron
// -------------------------------------------------- //

var flatiron = require('../../lib/flatiron'),
    fs       = require("fs"),
    app      = flatiron.app;

app.use(flatiron.plugins.http, {
  before: [function (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200);
      res.end(data);
    });
  }]
});

app.use(flatiron.plugins.socketio)

// Set the server to listen on port `8080`.
// It is important to do this first, as app.server
// isn't actually created until you start()
app.start(8080, function(){
  // Socket.io
  // -------------------------------------------------- //
  app.io.sockets.on('connection', function(socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function(data) {
      console.log(data);
    });
  });
});

