define(function (require, exports, module) {

var rich = require('rich');
var app = require('app/famous/core');
var backbone = require('backbone');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var scroll = require('rich/scrollview/scrollview');
var CubeView = require('./cube-view').CubeView;
var ScrollControlView = require('./scroll-control-view').ScrollControlView;
var Easing = require('famous/transitions/Easing');
var BounceDriver = require('rich/scrollview/scroll-drivers/bounce').BounceDriver;


var w = window.innerWidth;
var h = window.innerHeight;
var scrollH = h * 3;

var CubeScrollLayout = rich.ItemView.extend({
    name: 'CubeLayout',
    template: false,
    regions:{
        scrollContainer: rich.Region.extend({
            size: [w, h],
            modifier: function(){
                return new Modifier({
                    origin: [0.5, 0.5]
                });
            }
        })
    },

    initialize: function(){
        var scrollView =  this.scrollView = new scroll.ScrollView({
            className: 'scroll-view',
            // contentSize: [w, h * 4.14],
            contentSize: [w, h * 50],
            direction: scroll.DIRECTION_Y,
            perspective: 2000,
            hidesOverflow: false,
            scrollDriver: BounceDriver
        });

        this.listenTo(scrollView, 'scroll:update', this.onScrollUpdate);
        this.listenTo(scrollView, 'scroll:end', this.onScrollEnd);

        this.scrollControlView = new ScrollControlView({
            size: [w, h]
        });

        scrollView.addSubview(this.scrollControlView);

        this.addSubview(scrollView);
    },

    onScrollUpdate: function(data){
        var y = Math.abs(data[1]);
        y = Math.round(y);
        this.scrollControlView.setScrollPosition(y);
    },

    onScrollEnd: function(){
        // var pos = this.scrollControlView.getScrollPosition();
        // this.scrollView.setScrollPosition(0, pos, true, {duration: 500, curve: Easing.inOutQuad});
    },



});

exports.CubeScrollLayout = CubeScrollLayout;

});
