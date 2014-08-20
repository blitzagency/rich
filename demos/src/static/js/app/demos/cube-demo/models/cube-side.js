define(function( require, exports, module ){

var backbone = require('backbone');
var CubeSide = backbone.Model.extend({
    defaults: {
        size: null,
        color: 'red',
        content: null,
        tx: 0,
        ty: 0,
        tz: 0,
        rx: 0,
        ry: 0,
        rz: 0
    }
});

exports.CubeSide = CubeSide;

});
