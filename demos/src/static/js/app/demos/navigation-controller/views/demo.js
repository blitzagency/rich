define(function (require, exports, module) {

var _ = require('underscore');
var rich = require('rich');
var NavigationController = require('rich/controllers/navigation').NavigationController;
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var app = require('app/famous/core');
var utils = require('app/utils');
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var ActionsView = require('./actions-view').ActionsView;
var SlideButtonView = require('app/shared/views/button-view').SlideButtonView;

var actionsModifier = new Modifier({
    transform: Transform.translate(0, 0, 0)
});

var navModifier = new Modifier({
    transform: Transform.translate(0, 60, 0)
});

var NavigationControllerDemo = rich.LayoutView.extend({
    index: 0,

    regions:{
        actions: app.Region.extend({modifier: actionsModifier}),
        nav: app.Region.extend({modifier: navModifier}),
    },

    shouldInitializeRenderable: function(){
        return false;
    },

    initialize : function(){
        this.navigationController = new NavigationController({
            className: 'overflow-hidden',
            size: [320, 275]
        });

        this.actionsView = new ActionsView();
        this.listenTo(this.actionsView, 'push', this.wantsPush);
        this.listenTo(this.actionsView, 'pop', this.wantsPop);

        // so we can't spam the push/pop for this simple demo
        // it's not bullet proof for this demo, but it's better
        // than nothing.
        var delay = this.navigationController.transitionDuration;
        this.pushView = _.debounce(this.pushView.bind(this), delay, true);
        this.popView = _.debounce(this.popView.bind(this), delay, true);
    },

    onShow: function(){
        this.actions.show(this.actionsView);
        this.nav.show(this.navigationController);
    },

    wantsPush: function(){
        var rect = new Rectangle({
            size: [320, 275],
            color: utils.colors.blue[this.index]
        });

        var view = new RectangleView({model: rect});

        var button = new SlideButtonView();
        var buttonMod = new Modifier({
            transform: Transform.translate(10, 44, 0)
        });

        button.modifier = buttonMod;
        view.addSubview(button);

        this.pushView(view);
    },

    wantsPop: function(){
        this.popView();
    },

    pushView: function(view){
        this.navigationController.pushView(view);
        this.index++;
    },

    popView: function(){
        if(this.index > 1){
            this.index--;
        }

        this.navigationController.popView();
    }
});

exports.NavigationControllerDemo = NavigationControllerDemo;

});
