define(function (require, exports, module) {

var backbone = require('backbone');
var underscore = require('underscore');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var NavigationItem = require('./navigation-item').NavigationItem;
var NavigationModel = require('../models/navigation').NavigationModel;

var NavigationView = rich.CollectionView.extend({
    childView: NavigationItem,

    initialize : function(){

        var models = [
            new NavigationModel({label: 'subviews'}),
            new NavigationModel({label: 'nested subviews'}),
            new NavigationModel({label: 'sequential views'}),
            new NavigationModel({label: 'collection view'}),
            new NavigationModel({label: 'scrollview'}),
            new NavigationModel({label: 'navigation controller'}),
        ];

        this.collection = new backbone.Collection(models);
    },

    sizeForViewAtIndex: function(view, index){
        // dynamic sizing, you could also specify size: [w, h]
        // as an option on NavigationView if you knew you
        // wanted a consistent size
        var size = rich.utils.getViewSize(view);
        return size;
    },

    modifierForViewAtIndex: function(view, index){

        if(index === 0){
            return new Modifier();
        }

        var sum = 0;
        var padding = 15;
        this.children.some(function(view, currentIndex){

            if(index == currentIndex){
                return true;
            }

            var size = view.getSize();
            sum += size[0] + padding;
        });

        return new Modifier({
            transform: Transform.translate(sum, 0, 0)
        });
    }
});

exports.NavigationView = NavigationView;

});



// define(function (require, exports, module) {



//     function horizontalLayout(options){
//         options || (options = {});

//         var padding = options.padding || 0;

//         return function(view, index){
//             var size = view.getSize();
//             var offset = index * (size[0] + padding);

//             return new Modifier({
//                 transform: Transform.translate(offset, 0, 0)
//             });
//         };
//     }
