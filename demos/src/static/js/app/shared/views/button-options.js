define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/button-options');


var SlideButtonOptions = rich.ItemView.extend({
    template : template,
    size: [300, 50],

    triggers:{
        'click': 'close',
        'click .remove': 'remove'
    }
});

exports.SlideButtonOptions = SlideButtonOptions;

});
