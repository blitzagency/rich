define(function(require, exports, module) {

// Imports

var rich = require('rich');

//var _   = require('underscore');

describe('Layout:', function() {

    beforeEach(function() {
        console.log(22);
    });

    function newLayout(){
        var ConstraintLayout = rich.LayoutView.extend({

        });
        return new ConstraintLayout();
    }



    it('does this action', function(){
        var layout = newLayout();
        console.log(layout);
    });

}); // eof describe
}); // eof define
