define(function (require, exports, module) {

var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var app = require('app/famous/core');
var NavigationView = require('./navigation-view').NavigationView;
var SubviewDemo = require('app/demos/subviews/views/demo').SubviewDemo;
var NestedSubviewDemo = require('app/demos/nested-subviews/views/demo').NestedSubviewDemo;
var SequentialViewDemo = require('app/demos/sequential-views/views/demo').SequentialViewDemo;
var CollectionViewDemo = require('app/demos/collection-view/views/demo').CollectionViewDemo;
var NavigationControllerDemo = require('app/demos/navigation-controller/views/demo').NavigationControllerDemo;
var ScrollviewDemo = require('app/demos/scrollview/views/demo').ScrollviewDemo;
var utils = require('app/utils');


var navigationModifier = new Modifier({
        transform: Transform.translate(10, 10, 0)
});

var contextModifier = new Modifier({
        transform: Transform.translate(10, 60, 0)
});

var DemoLayout = rich.LayoutView.extend({
    name: 'DemoLayout',
    regions:{
        navigation: app.Region.extend({modifier: navigationModifier}),
        demo: app.Region.extend({modifier: contextModifier})
    },

    constraints: [{
        target: 'navigation',
        attribute: 'width',
        to: 'superview',
        toAttribute: 'width',
        value: '50%'
    },
    {
        target: 'demo',
        attribute: 'top',
        to: 'superview',
        toAttribute: 'top',
        value: '0'
    },
    {
        target: 'demo',
        attribute: 'width',
        to: 'superview',
        toAttribute: 'width',
        value: '50%'
    }],



    shouldInitializeRenderable: function(){
        return false;
    },

    onShow : function(){
        this.navigationView = new NavigationView();
        this.listenTo(this.navigationView, 'childview:navigate', this.wantsNavigation);

        this.navigation.show(this.navigationView);

    },

    wantsNavigation: function(view){
        var label = view.model.get('label');
        var next = null;

        switch(label){
            case 'subviews':
                next = new SubviewDemo();
                break;
            case 'nested subviews':
                next = new NestedSubviewDemo();
                break;
            case 'sequential views':
                next = new SequentialViewDemo();
                break;
            case 'collection view':
                next = new CollectionViewDemo();
                break;
            case 'scrollview':
                next = new ScrollviewDemo();
                break;
            case 'navigation controller':
                next = new NavigationControllerDemo();
                break;
        }

        // this.demo.show(next);


    }
});

exports.DemoLayout = DemoLayout;

});
