var Remote = new Backbone.Marionette.Application(),
    App = Remote;

Remote.addRegions({
    body: "#body"
});

Remote.addInitializer(function () {
  this.remote = new this.Models.Remote();
  this.remote.fetch();
  Swag.registerHelpers();
});

Remote.on("start", function () {
  Backbone.history.start({pushState: true});
  Backbone.history.navigate("display", { trigger: true });
});
