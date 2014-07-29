define(function(require, exports, module) {

var marionette = require('marionette');
var DemoLayout = require('app/navigation/views/demo-layout').DemoLayout;

var ApplicationDelegate = marionette.Controller.extend({

    initialize: function(options){
        // This call is required to initialize the
        // BUILT App foundation. See below for what's done.
        // You can customize that as necessary.
        this.app = options.app;
        this.app.window.show(new DemoLayout());
    }
});

exports.ApplicationDelegate = ApplicationDelegate;
});
