define(function( require, exports, module ){

var backbone = require('backbone');
var Rectangle = backbone.Model.extend({
    defaults: {
        size: null,
        color: 'red',
        content: null,
        tx: 0,
        ty: 0
    }
});

exports.Rectangle = Rectangle;

});
