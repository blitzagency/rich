define(function (require, exports, module) {

var rich = require('rich');

var Transform = require('famous/core/Transform');
var Easing = require('famous/transitions/Easing');

var SlideButton = require('./button-main').SlideButton;
var SlideButtonOptions = require('./button-options').SlideButtonOptions;


var SlideButtonView = rich.View.extend({
    nestedSubviews: true,
    className: 'overflow-hidden',
    size: [300, 50],

    initialize : function(){
        this.button = new SlideButton({model: this.model});
        this.buttonOptions = new SlideButtonOptions({model: this.model});

        this.addSubview(this.buttonOptions);
        this.addSubview(this.button);

        this.listenTo(this.button, 'open', this.wantsOpen);
        this.listenTo(this.buttonOptions, 'close', this.wantsClose);
        this.listenTo(this.buttonOptions, 'remove', this.wantsRemove);
    },


    wantsOpen: function(){
        this.open();
    },

    wantsClose: function(){
        this.close();
    },

    wantsRemove: function(){
        this.trigger('remove', this);
    },

    open: function(){
        this.button.setTransform(
            Transform.translate(300, 0, 0),
            { duration : 200, curve: Easing.outQuad }
        );
    },

    close: function(){
        this.button.setTransform(
            Transform.identity,
            { duration : 200, curve: Easing.outQuad }
        );
    },

});

exports.SlideButtonView = SlideButtonView;

});
