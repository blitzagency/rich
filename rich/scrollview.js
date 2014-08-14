define(function (require, exports, module) {
    var rich = require('rich');
    var FamousScrollview = require('famous/views/Scrollview');


    var Scrollview = rich.View.extend({

        constructor: function(options){
            // this.setNeedsDisplay(true);
            options || (options = {});

            // this._scrollableView = new FamousScrollview();

            rich.View.prototype.constructor.apply(this, arguments);

        },


    });

    exports.Scrollview  = Scrollview;
});
