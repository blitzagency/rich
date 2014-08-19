define(function(require, exports, module) {

var marionette = require('marionette');
var backbone = require('backbone');
var rich = require('rich');
// var DemoLayout = require('app/navigation/views/demo-layout').DemoLayout;


var utils = require('app/utils');
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var constraintWithJSON = require('rich/autolayout/constraints').constraintWithJSON;

var AppContainer = require('app/container/views/app-container').AppContainer;

var ApplicationDelegate = marionette.Controller.extend({

    initialize: function(options){
        // This call is required to initialize the
        // BUILT App foundation. See below for what's done.
        // You can customize that as necessary.
        this.app = options.app;
        this.app.window.addSubview(new AppContainer());
    },

});

exports.ApplicationDelegate = ApplicationDelegate;
});
