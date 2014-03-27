Remote.module('Control', function(Control, App, Backbone, Marionette, $, _) {

  // Router
  // ---------------
  //
  // Handle routes to show the active vs complete todo items

  Control.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'display'    : 'showRemoteControl'
    }
  });




  // Controller (Mediator)
  // ------------------------------
  //
  // Control the workflow and logic that exists at the application
  // level, above the implementation detail of views and models

  Control.Controller = function() {};

  _.extend(Control.Controller.prototype, {

    showRemoteControl: function() {
      var options = {};
      this.appBody = new App.Layout.Body(options);
      App.body.show(this.appBody);
      var powerButton = new Remote.Control.Views.PowerButtonView({model: App.remote}),
          macroButtons = new Remote.Control.Views.MacroButtonsView({model: App.remote}),
          muteButton = new Remote.Control.Views.MuteButtonView({model: App.remote}),
          numberButtons = new Remote.Control.Views.NumberButtonsView({model: App.remote});
      this.appBody.power.show(powerButton);
      this.appBody.macros.show(macroButtons);
      this.appBody.volume.show(muteButton);
      this.appBody.main.show(numberButtons);
    }

  });

  // Initializer
  // --------------------
  //
  // Get the Controller up and running by initializing the mediator
  // when the the application is started.

  Control.addInitializer(function() {

    var controller = new Control.Controller();
    new Control.Router({
      controller: controller
    });

  });

});
