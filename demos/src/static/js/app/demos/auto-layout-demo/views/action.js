define(function (require, exports, module) {

var rich = require('rich');
var utils = require('app/utils');
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;

var Action = RectangleView.extend({
    autoLayoutTransition: {
        duration: 500
    },
});

exports.Action = Action;

});
