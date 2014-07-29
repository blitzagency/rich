define(function (require, exports, module) {

var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var SlideButtonView = require('app/shared/views/button-view').SlideButtonView;
var EmptyView = require('app/shared/views/empty-view').EmptyView;


var ButtonCollectionView = rich.CollectionView.extend({
    childView: SlideButtonView,
    emptyView: EmptyView,
    size: [300, 400],

    modifierForViewAtIndex: function(view, index){
        // each of our buttons is the same height.

        var padding = 2;
        var height = view.getSize()[1];
        var offset = index * (height + padding);

        return new Modifier({
            transform: Transform.translate(0, offset, 0)
        });
    }
});

exports.ButtonCollectionView = ButtonCollectionView;

});
