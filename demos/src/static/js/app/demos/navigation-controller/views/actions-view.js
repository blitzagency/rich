define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/actions-view');

var ActionsView = rich.ItemView.extend({
    template : template,
    size: [100, 40],

    triggers: {
        'click .push': 'push',
        'click .pop': 'pop'
    }
});

exports.ActionsView = ActionsView;

});
