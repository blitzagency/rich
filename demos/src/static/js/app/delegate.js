define(function(require, exports, module) {

var marionette = require('marionette');
// var DemoLayout = require('app/navigation/views/demo-layout').DemoLayout;


var utils = require('app/utils');
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var constraintWithJSON = require('rich/autolayout/constraints').constraintWithJSON;

var ApplicationDelegate = marionette.Controller.extend({

    initialize: function(options){
        // This call is required to initialize the
        // BUILT App foundation. See below for what's done.
        // You can customize that as necessary.
        this.app = options.app;

        var color0 = new Rectangle({
            color: utils.colors.blue[7],
        });

        var navigation = new RectangleView({model: color0});

        this.app.window.addSubview(navigation);
        this.app.window.constraints = function(){
            return [
                {
                    item: navigation,
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 100
                },

                {
                    item: navigation,
                    attribute: 'bottom',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'bottom',
                    constant: 0
                }
            ];
        };
    }
});

exports.ApplicationDelegate = ApplicationDelegate;
});
