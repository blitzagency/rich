define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/actions-view');

var ActionsView = rich.ItemView.extend({
    template : template,
    className: 'action',
    size: [100, 25],

    triggers: {
        'click': 'add'
    },

});

exports.ActionsView = ActionsView;

});
