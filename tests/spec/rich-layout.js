define(function(require, exports, module) {

// Imports

var rich = require('rich');
var _        = require('underscore');

describe('Layout:', function() {

    var region = new rich.Region({
        el:'body'
    });

    function newLayout(){

        var ConstraintLayout = rich.LayoutView.extend({
            constraints: [{
                target: 'navigation',
                attribute: 'width',
                to: 'superview',
                toAttribute: 'width',
                value: '50%'
            },
            {
                target: 'demo',
                attribute: 'top',
                to: 'superview',
                toAttribute: 'top',
                value: '0'
            },
            {
                target: 'demo',
                attribute: 'width',
                to: 'superview',
                toAttribute: 'width',
                value: '50%'
            }],
        });
        return new ConstraintLayout();
    }

    it('does this action', function(done){
        var layout = newLayout();
        region.show(layout);

        // have to wait 1 render cycle
        setTimeout(function(){
            console.log(layout._constraints);
            done();
        }, 100);
    });

}); // eof describe
}); // eof define
