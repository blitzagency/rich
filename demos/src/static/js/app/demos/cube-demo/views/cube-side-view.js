define(function (require, exports, module) {

var rich = require('rich');
var StateModifier = require('famous/modifiers/StateModifier');
var Transform = require('famous/core/Transform');
var Modifier = require('famous/core/Modifier');
var template = require('hbs!../templates/cube-side-view');

var CubeSideView = rich.ItemView.extend({
    template: template,
    className: 'cube-side',

    triggers: {
        'click': 'click'
    },

    initialize: function(){
        this.setSize(this.model.get('size'));

        var posMod = new Modifier({
            transform: Transform.translate(
            this.model.get('tx'),
            this.model.get('ty'),
            this.model.get('tz'))
        });


        var rotationXMod = new Modifier({
            transform: Transform.rotateX(this.model.get('rx'))
        });

        var rotationYMod = new Modifier({
            transform: Transform.rotateY(this.model.get('ry'))
        });

        var rotationZMod = new Modifier({
            transform: Transform.rotateZ(this.model.get('rz'))
        });

        this.modifier = [rotationXMod, rotationYMod, rotationZMod, posMod];

    },

    onShow: function(){
    },
});

exports.CubeSideView = CubeSideView;

});
