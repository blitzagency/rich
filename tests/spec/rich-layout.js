define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');

describe('Layout:', function() {
    var region;
    var $el;

    beforeEach(function() {
        loadFixtures('famous.html');

        region = new rich.Region({
            el: '#famous-context'
        });

        $el = region.el;
    });

    it('builds a constraint', function(done){
        var layout = new rich.LayoutView();
        region.show(layout);
        var constraint = {
            target: 'demo',
            attribute: 'width',
            to: 'superview',
            toAttribute: 'width',
            value: '50px'
        };

        // need to wait a render cycle
        setTimeout(function(){
            layout._buildModifierForConstraint(new Modifier(), constraint);
            done();
        }, 100);

    });

}); // eof describe
}); // eof define
