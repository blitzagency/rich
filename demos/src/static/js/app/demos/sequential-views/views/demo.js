 define(function (require, exports, module) {

var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var VerticalSequentialView = require('rich/collections-sequential').VerticalSequentialView;
var HorizontalSequentialView = require('rich/collections-sequential').HorizontalSequentialView;
var app = require('app/famous/core');
var utils = require('app/utils');
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var Rectangle = require('app/shared/models/rectangle').Rectangle;


var verticalModifier = new Modifier({
        transform: Transform.translate(0, 0, 0)
});

var horizontalModifier = new Modifier({
        transform: Transform.translate(105, 100, 0)
});

var SequentialViewDemo = rich.LayoutView.extend({

    regions:{
        vertical: app.Region.extend({modifier: verticalModifier}),
        horizontal: app.Region.extend({modifier: horizontalModifier})
    },

    shouldInitializeRenderable: function(){
        return false;
    },

    onShow : function(){

        var rect1 = new Rectangle({
            size: [100, 100],
            color: utils.colors.blue[3]
        });

        var rect2 = new Rectangle({
            size: [100, 100],
            color: utils.colors.blue[5]
        });

        var rect3 = new Rectangle({
            size: [100, 100],
            color: utils.colors.blue[7],
        });

        var rect1View = new RectangleView({model: rect1, zIndex: 3});
        var rect2View = new RectangleView({model: rect2, zIndex: 4});
        var rect3View = new RectangleView({model: rect3, zIndex: 5});

        var rect4View = new RectangleView({model: rect1, zIndex: 3});
        var rect5View = new RectangleView({model: rect2, zIndex: 4});
        var rect6View = new RectangleView({model: rect3, zIndex: 5});

        var v = new VerticalSequentialView();
        var h = new HorizontalSequentialView();

        v.addSubview(rect1View);
        v.addSubview(rect2View);
        v.addSubview(rect3View);

        h.addSubview(rect4View);
        h.addSubview(rect5View);
        h.addSubview(rect6View);

        this.vertical.show(v);
        this.horizontal.show(h);
    }
});

exports.SequentialViewDemo = SequentialViewDemo;

});
