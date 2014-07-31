define(function (require, exports, module) {

var rich = require('rich');
var app = require('app/famous/core');
var backbone = require('backbone');
var scroll = require('rich/scrollview');
var VerticalCollection = require('app/demos/scrollview/views/vertical-collection').VerticalCollection;
var SubviewDemo = require('app/demos/subviews/views/demo').SubviewDemo;

var ScrollviewDemo = rich.LayoutView.extend({

    regions:{
        scrollContainer: app.Region.extend({
            size: [400, 400]
        }),
    },

    shouldInitializeRenderable: function(){
        return false;
    },

    onShow: function(){
        var scrollView = new scroll.ScrollView({
            contentSize: [2000, 2200],
            direction: scroll.DIRECTION_Y
        });

        var collection = new backbone.Collection();
        _.each(_.range(10), function(i){
            collection.add({index: i});
        });

        var verticalCollection = new VerticalCollection({
            collection: collection
        });

        scrollView.addSubview(verticalCollection);

        this.scrollContainer.show(scrollView);
    },



});

exports.ScrollviewDemo = ScrollviewDemo;

});
