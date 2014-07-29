define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/empty-view');

var EmptyView = rich.ItemView.extend({
    template : template,
    size: [300, 200],

});

exports.EmptyView = EmptyView;

});
