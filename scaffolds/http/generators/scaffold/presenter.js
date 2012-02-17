var app = require('flatiron').app;

app.presenters.#NAME = {

  _before: [
    {exec: '_get', except: ['index', 'new', 'create']}
  ],

  index: function () {
    var self = this;
    app.#CAMEL.all(function (err, data) {
      self.data.#NAME = data;
      self.render();
    });
  },

  new: function () {
    this.data.#SINGNAME = app.#CAMEL.new({});
    this.render();
  },

  create: function () {
    var self = this;
    this.data.#SINGNAME = app.#CAMEL.new(this.req.body);
    this.data.#SINGNAME.save(function (err, data) {
      if (err) {
        self.render('new');
      } else {
        self.redirect('/#NAME/' + this.data.#SINGNAME.id);
      }
    })
  },

  show: function (id) {
    this.render();
  },

  edit: function (id) {
    this.render();
  },

  update: function (id) {
    var self = this;
    this.data.#SINGNAME.update(this.req.body, function (err, data) {
      if (err) {
        self.render('edit');
      } else {
        self.redirect('/#NAME/' + id);
      }
    });
  },

  destroy: function (id) {
    var self = this;
    this.data.#SINGNAME.destroy(function (err, data) {
      self.redirect('/#NAME');
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
