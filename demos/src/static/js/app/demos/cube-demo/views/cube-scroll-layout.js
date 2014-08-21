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

var CubeScrollLayout = rich.ItemView.extend({
    name: 'CubeLayout',
    template: false,
    regions:{
        scrollContainer: rich.Region.extend({
            modifier: function(){
                return new Modifier({
                });
            }
        })
    },

    initialize: function(){
        var scrollView =  this.scrollView = new scroll.ScrollView({
            className: 'scroll-view',
            // contentSize: [w, h * 4.14],
            contentSize: function(){
                var size = this.getSize();
                size[1] = size[1] * 50;
                return size;
            },
            direction: scroll.DIRECTION_Y,
            perspective: 1000,
            hidesOverflow: false,
            scrollDriver: BounceDriver
        });

        this.listenTo(scrollView, 'scroll:update', this.onScrollUpdate);
        this.listenTo(scrollView, 'scroll:end', this.onScrollEnd);

        this.scrollControlView = new ScrollControlView({
            size: this.getSize.bind(this)
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
