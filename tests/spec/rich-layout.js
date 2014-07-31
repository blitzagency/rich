define(function(require, exports, module) {

// Imports

var rich = require('rich');
var _        = require('underscore');
var Modifier = require('famous/core/Modifier');

describe('Layout:', function() {

    var region = new rich.Region({
        el:'body'
    });


    it('builds a constraint', function(done){
        var layout = new rich.LayoutView();
        region.show(layout);
        var constraint = {
            target: 'demo',
            attribute: 'width',
            to: 'superview',
            toAttribute: 'width',
            value: '50'
        };

        // need to wait a render cycle
        setTimeout(function(){
            console.log($('body').height())
            layout._buildModifierForConstraint(new Modifier(), constraint);
            done();
        }, 100);
    });

}); // eof describe
}); // eof define
