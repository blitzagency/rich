define(function (require, exports, module) {

var rich = require('rich');
var ColorfulCell = require('./colorful-cell').ColorfulCell;
var HorizontalCollection = require('./horizontal-collection').HorizontalCollection;
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var scroll = require('rich/scrollview/scrollview');


var VerticalCollection = rich.CollectionView.extend({
    count:0,
    childView: HorizontalCollection,


    sizeForEmptyView: function(view){
        var size = rich.utils.getViewSize(view);
        return size;
    },

    buildChildView: function(child, ChildViewClass, childViewOptions){
        var options = _.extend({model: child}, childViewOptions);
        var view = new HorizontalCollection(options);
        var scrollview = new scroll.ScrollView({
            contentSize: view.getSize(),
            direction: scroll.DIRECTION_X,
            size: [400, 210],
            name: 'foo'+this.count++
        });
        scrollview.addSubview(view);
        return scrollview;
    },


    modifierForViewAtIndex: function(view, index){
        var size = view.getSize();
        var offset = index * (size[1]+10);
        return new Modifier({
            transform: Transform.translate(0, offset, 0)
        });
    }
});

exports.VerticalCollection = VerticalCollection;

});



