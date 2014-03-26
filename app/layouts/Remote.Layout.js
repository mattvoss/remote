Remote.module('Layout', function(Layout, App, Backbone, Marionette, $, _) {

  Layout.Body = Marionette.Layout.extend({
    initialize: function(options){
      this.options = _.extend(options);
      var view = this;
      this.addRegions({
        main: "#main",
        volume: "#volume",
        power: "#power",
        macros: "#macros"
      });
      this.template = Templates.body;
      App.vent.on('layout:resize', function (bg) {
        //view.resize();
      });
    },
    className: "remote-container",
    // UI bindings create cached attributes that
    // point to jQuery selected objects
    ui: {

    },

    events: {

    },
    resize: function() {

    },

    onShow: function() {
      this.resize();
    }
  });


});
