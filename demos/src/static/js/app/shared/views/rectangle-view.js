define(function (require, exports, module) {

var rich = require('rich');
var StateModifier = require('famous/modifiers/StateModifier');
var Transform = require('famous/core/Transform');

var template = require('hbs!../templates/rectangle-view');

var RectangleView = rich.ItemView.extend({
    template : template,

    triggers: {
        'click': 'click'
    },

    initialize : function(options){
        options || (options = {});

        if(!options.modifier){
            var transform = Transform.translate(
                this.model.get('tx'),
                this.model.get('ty'),
                this.model.get('tz'));

            this.modifier = new StateModifier({
                transform: transform
            });
        }

    },

    serializeData: function(){

        var suggestedSize = this.model.get('size');

        if(!suggestedSize){
            suggestedSize = [0, 0];
        }

        var size = {};

        size.x = suggestedSize[0] > 0 ? suggestedSize[0] + 'px' : '100%';
        size.y = suggestedSize[1] > 0 ? suggestedSize[1] + 'px' : '100%';

        var obj = {
            size: size,
            color: this.model.get('color')
        };

        return obj;
    },
});

exports.RectangleView = RectangleView;

});
