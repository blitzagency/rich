define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var colors = require('tests/utils/colors').blue;



describe('ItemView Events:', function() {
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
        region.reset();
        region = null;
    });


    it('bindings work', function(){
        var model = new Rectangle();
        var view = new RectangleView({model: model});
        region.show(view);
        console.log('called')
    });


}); // eof describe
}); // eof define
