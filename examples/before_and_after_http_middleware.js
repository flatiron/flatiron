/*
  
  Simple example for middleware:
  
  Logs "a" from the before
  Logs "b" from the route
  Sends the user a response that is altered in transformStream
  Logs "c" from end

*/
var union = require('union'),
    flatiron = require('../lib/flatiron'),
    app = flatiron.app,
    transformStream = new union.ResponseStream();

transformStream.on('data', function (json) { 
  json = JSON.parse(json);
  json.foo = "baz";
  // this.write(JSON.stringify(json)); // infinite loop
});

transformStream.on('end', function () { 
  console.log("c");
});

app.use(flatiron.plugins.http, 
  { before: [ function(req, res) { console.log("a"); res.emit("next"); } ] 
  , after : [ transformStream ]
  });

app.router.get('/', function () {
  console.log("b");
  this.res.json({ 'foo': 'bar' });
});

app.start(8080);

// curl localhost:8080