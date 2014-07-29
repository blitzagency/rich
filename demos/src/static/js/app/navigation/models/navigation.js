define(function( require, exports, module ){

var backbone = require('backbone');

var NavigationModel = backbone.Model.extend({
    defaults: {
        label: null
    }
});

exports.NavigationModel = NavigationModel;

});
