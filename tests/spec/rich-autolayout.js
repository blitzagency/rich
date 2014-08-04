define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var render = require('tests/utils/time').render;
var colors = require('tests/utils/colors').blue;



describe('Auto Layout:', function() {
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


    xit('initializes variables', function(){
        var model = new Rectangle();
        var view = new RectangleView({model: model});
        region.show(view);
        expect(view._autolayout).not.toBe(undefined);
    });

    it('parses constraints object', function(){
        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    target: 'navigation',
                    attribute: 'width',
                    to: 'superview',
                    toAttribute: 'width',
                    value: '50%'
                }
            ]
        });
        region.show(view);

    });


}); // eof describe
}); // eof define
