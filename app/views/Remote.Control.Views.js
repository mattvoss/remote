Remote.module('Control.Views', function(Views, App, Backbone, Marionette, $, _) {

  // Edit View
  // --------------

  Views.AttendeeFormView = Marionette.ItemView.extend({
      template: Templates.attendeesForm,
      className: "panel panel-default",
      events: {
        "click .update"   : "updateAttendee"
      },

      modelEvents: {
        'change': 'fieldsChanged'
      },

      initialize: function() {
        if (this.model.get("id")) this.model.set({uuid: this.model.get("id")});
        this.justUpdated = false;
      },

      fieldsChanged: function() {
        this.justUpdated = true;
        this.render();
      },

      onRender: function(e) {
        var submit = "<div class='form-group'><button type=\"submit\" class=\"btn btn-primary update\">Update</button></div>";
        this.form = new Backbone.Form({
            model: this.model
        }).render();

        this.$el.find(".panel-body").append(this.form.el).append(submit);
        if (this.justUpdated) {
          this.justUpdated = false;
          this.$el.find("#collapse"+this.model.get("uuid")).addClass("in");
        }
        this.$el.on('show.bs.collapse', function () {
          $("i.fa-plus-circle", $(this)).removeClass('fa-plus-circle').addClass('fa-minus-circle');
          $('html,body').animate({'scrollTop':$('.fa-minus-circle').position().top},500);
        });
        this.$el.on('hide.bs.collapse', function () {
          $("i.fa-minus-circle", $(this)).removeClass('fa-minus-circle').addClass('fa-plus-circle');
        });
      },

      updateAttendee: function(e) {
        var view = this;
        if (typeof this.form.commit() === 'undefined') {
          $(".update", this.$el).attr("disabled", "disabled");
          this.model.save(
            {},
            {
              success: function(model, response, options) {
                var firstname = model.get("firstname"),
                    lastname = model.get("lastname");

                Messenger().post("Exhibitor Attendee ["+lastname+", "+firstname+"] has been updated.");
                $(".update", view.$el).removeAttr("disabled");
              },
              error: function(model, xhr, options) {
                if (view.$el.find('.alert').length > 0) view.$el.find('.alert').remove();
                view.$el.find('.page-header').before('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>There has been a error trying to create this race. This is what the server told me: <strong>'+xhr.responseJSON.messsage.detail+'</strong></div>');
                $(".update", view.$el).removeAttr("disabled");
                $('html, body').animate({
                  scrollTop: $(".alert-dismissable").offset().top-70
                }, 2000);

              }
            }
          );
        }
      }
  });

  Views.EditAttendeesView = Marionette.CompositeView.extend({
      template: Templates.editForm,
      itemView : Views.AttendeeFormView,
      itemViewContainer: "#accordion",
      className: "row",

      initialize: function() {

      },

      onRender: function() {

      },

      onShow: function(e) {
        //$(".panel-collapse:first", this.$el).addClass("in");
      }

  });

  Views.PowerButtonView = Marionette.ItemView.extend({
      template: Templates.powerButton,
      className: "block block-power",
      events: {
        "click #btnPower"    : "power"
      },
      initialize: function(){
        this.powerStat = false;
      },

      onRender: function() {

      },

      power: function(e) {
        $("#btnPower", this.$el).toggleClass('on');
        var value = (this.powerStat) ? "off" : "on";
            power = Remote.remote.get("history").create({type: "power", action: "", profile:"sat", value: value});
        //power.save();
        this.powerStat = (this.powerStat) ? false : true;

      }
  });

  Views.MacroButtonsView = Marionette.ItemView.extend({
      template: Templates.macros,
      className: "block block-macros",
      events: {
        "click .button"    : "switchMacro"
      },
      initialize: function(){
        //this.powerStat = false;
      },

      onRender: function() {

      },

      switchMacro: function(e) {
        $(".button", this.$el).removeClass('active');
        $(e.target.parentNode).addClass("active");
        var profile = $(e.target).attr("data-macro");
            macro = Remote.remote.get("history").create({type: "macros", action: "", profile: profile, value: ""});
      }
  });

  Views.MuteButtonView = Marionette.ItemView.extend({
      template: Templates.muteButton,
      className: "block block-mute",
      events: {
        "click #btnMute"    : "mute"
      },
      initialize: function(){
        this.muteStat = false;
      },

      onRender: function() {

      },

      mute: function(e) {
        $("#btnMute", this.$el).toggleClass('on');
        var action = (this.muteStat) ? "onkyo.UnMute" : "onkyo.Mute";
            mute = Remote.remote.get("history").create({type: "action", action: action, value: ""});
        //mute.save();
        this.muteStat = (this.muteStat) ? false : true;

      }
  });

  // Application Event Handlers
  // --------------------------


});
