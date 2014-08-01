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

        this.setSize(this.model.get('size'));

        if(!options.modifier){
            var transform = Transform.translate(
                this.model.get('tx'),
                this.model.get('ty'),
                this.model.get('tz'));

            this.modifier = new StateModifier({
                transform: transform
            });
        }

    }
});

exports.RectangleView = RectangleView;

});
