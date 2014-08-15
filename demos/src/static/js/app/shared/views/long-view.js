define(function (require, exports, module) {

var rich = require('rich');
var _ = require('underscore');
var backbone = require('backbone');
var StateModifier = require('famous/modifiers/StateModifier');
var Transform = require('famous/core/Transform');

var template = require('hbs!../templates/long-view');

var LongView = rich.ItemView.extend({
    template : template,
    serializeData: function(){
        var blocks = [];
        _.each(_.range(20), function(i){
            blocks.push("hsl(" + (i * 360 / 40) + ", 100%, 50%)");
        }, this);
        return {
            blocks:blocks
        };
    },
});

exports.LongView = LongView;

});
