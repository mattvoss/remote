Remote.module('Models', function(Models, App, Backbone, Marionette, $, _) {

  Models.Keypress = Backbone.SuperModel.extend({
    url: function() {
      var action = this.get("type");
      return this.collection.remote.url()+'/'+ action;
    },
    defaults: {
      type: 'action',
      action: 'directv.keypress',
      value: ''
    }
  });

  Models.History = Backbone.Collection.extend({
    model: Models.Keypress
  });

  Models.Remote = Backbone.SuperModel.extend({
    name: 'remote',
    urlRoot: '/api/remote',
    idAttribute: "id",
    defaults: {

    },
    relations: {
      'history': Models.History
    },
    validate: function(attrs, options) {

    },
    initialize: function() {
      //if (this.isNew()) this.set('created', Date.now());
    }
  });

});
