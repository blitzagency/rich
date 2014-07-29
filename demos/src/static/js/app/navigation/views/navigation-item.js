define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/navigation-item');

var NavigationItem = rich.ItemView.extend({
    template : template,
    className: 'button',
    triggers: {
        'click': 'navigate'
    },

});

exports.NavigationItem = NavigationItem;

});
