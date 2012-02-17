var app = require('flatiron').app;

app.presenters.#NAME = {

  _before: [
    {exec: '_get', except: ['index', 'create']}
  ],

  index: function () {
    var self = this;
    app.#CAMEL.all(function (err, data) {
      self.res.json(data);
    });
  },

  create: function () {
    var self = this;
    this.data.#SINGNAME = app.#CAMEL.new(this.req.body);
    this.data.#SINGNAME.save(function (err, data) {
      self.res.json(201, data);
    })
  },

  show: function (id) {
    this.res.json(this.data.#SINGNAME);
  },

  update: function (id) {
    var self = this;
    this.data.#SINGNAME.update(this.req.body, function (err, data) {
      self.res.json(data);
    });
  },

  destroy: function (id) {
    var self = this;
    this.data.#SINGNAME.destroy(function (err, data) {
      self.res.json(204);
    });
  },

  _get: function (callback, args) {
    var self = this;
    app.#CAMEL.get(args[0], function (err, data) {
      self.data.#SINGNAME = data;
      callback();
    })
  }

};
