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
        expect($el.length).toBe(1);
    });

    afterEach(function() {
        region = null;
    });


    it('throws error with bad constraint width width px', function(done){
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
            function build(){
                layout._buildModifierForConstraint(new Modifier(), constraint);
            }
            expect(build).toThrow();
            done();
        }, 100);

    });

    xit('sets a constraint to a width', function(done){
        var layout = new rich.LayoutView();
        region.show(layout);
        // needs to pass
        var constraint = {
            target: 'demo',
            attribute: 'width',
            value: '50px'
        };

        // need to wait a render cycle
        setTimeout(function(){
            layout._buildModifierForConstraint(new Modifier(), constraint);
            done();
        }, 100);

    });

    xit('sets left to a percent width of superview', function(done){
        var layout = new rich.LayoutView();
        region.show(layout);
        // should pass
        var constraint = {
            target: 'demo',
            attribute: 'left',
            to: 'superview',
            toAttribute: 'width',
            value: '50%'
        };

        // need to wait a render cycle
        setTimeout(function(){
            layout._buildModifierForConstraint(new Modifier(), constraint);
            done();
        }, 100);

    });

}); // eof describe
}); // eof define
