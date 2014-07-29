define(function (require, exports, module) {

var rich = require('rich');
var backbone = require('backbone');
var ColorfulCell = require('./colorful-cell').ColorfulCell;
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');

var HorizontalCollection = rich.CollectionView.extend({
    childView: ColorfulCell,

    initialize: function(){
        this.collection = new backbone.Collection();
        _.each(_.range(10), function(i){
            this.collection.add({index: i});
        }, this);
    },

    sizeForEmptyView: function(view){
        var size = rich.utils.getViewSize(view);
        return size;
    },

    getSize: function(){
        return [2000, 200];
    },

    modifierForViewAtIndex: function(view, index){
        var size = view.getSize();
        var offset = index * (size[0]);
        // console.log(offset)
        return new Modifier({
            transform: Transform.translate(offset, 0, 0)
        });
    }
});

exports.HorizontalCollection = HorizontalCollection;

});



