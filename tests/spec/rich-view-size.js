define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var matrix = require('tests/utils/matrix');
var css = require('tests/utils/css');
var render = require('tests/utils/time').render;
var colors = require('tests/utils/colors').blue;


describe('View+Size:', function() {
    var region;
    var context;
    var $el;

    beforeEach(function() {
        loadFixtures('famous.html');

        region = new rich.Region({
            el: '#famous-context'
        });

        $el = region.el;
        context = region.context;
        expect($el.length).toBe(1);
        expect(context).not.toBe(undefined);
        //jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });


    afterEach(function() {
        region = null;
    });


    it('uses size as function', function(done){
        done();
    });

    it('uses size', function(done){
        done();
    });


}); // eof describe
}); // eof define
