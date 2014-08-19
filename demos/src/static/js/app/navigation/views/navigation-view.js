define(function (require, exports, module) {

var backbone = require('backbone');
var underscore = require('underscore');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var NavigationItem = require('./navigation-item').NavigationItem;

var utils = require('rich/utils');

var NavigationView = rich.CollectionView.extend({
    childView: NavigationItem,
    orientation: 'horizontal',

    sizeForViewAtIndex: function(view, index){
        // dynamic sizing, you could also specify size: [w, h]
        // as an option on NavigationView if you knew you
        // wanted a consistent size
        var size = utils.getViewSize(view);
        size[0] = size[0] + 10;
        return size;
    },

});

exports.NavigationView = NavigationView;

});

