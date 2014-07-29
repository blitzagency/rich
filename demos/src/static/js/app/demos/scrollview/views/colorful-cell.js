define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/colorful-cell');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');


var ColorfulCell = rich.ItemView.extend({
    template: template,
    size: [200, 200],

    events: {
        'click' : 'clicking'
    },

    clicking: function(){
        this.invalidate();
    },


    serializeData: function(){
        // whatever...just needed some varient
        function toColor(num) {
            num = num * 20;
            num >>>= 0;
            var b = num & 0xFF,
                g = (num & 0xFF00) >>> 8,
                r = (num & 0xFF0000) >>> 16,
                a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
            return "rgb(" + [r, g, b].join(",") + ")";
        }
        return {
            color:toColor(this.model.get('index')),
            width:this.size[0],
            height:this.size[1],
        };
    },
});

exports.ColorfulCell = ColorfulCell;

});
