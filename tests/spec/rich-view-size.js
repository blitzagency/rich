define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var utils = require('rich/utils');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var matrix = require('tests/utils/matrix');
var css = require('tests/utils/css');
var render = require('tests/utils/time').render;
var colors = require('tests/utils/colors').blue;
var Setup = require('tests/utils/setup').Setup;

describe('View+Size:', function() {

    beforeEach(function() {
        loadFixtures('famous.html');

    });

    afterEach(function() {

    });

    it('uses size', function(){
        var context = new Setup();
        var region = context.region;
        var root = context.root;

        var view = new rich.View({size: [20, 20]});

        root.addSubview(view);

        expect(view.getSize()).toEqual([20, 20]);
        context.done();
    });

    it('uses size as function', function(){
        var context = new Setup();
        var region = context.region;
        var root = context.root;

        var obj = {
            size: function(){
                return [20, 20];
            }
        };

        var spy = spyOn(obj, 'size').and.callThrough();

        var view = new rich.View({size: obj.size});
        view.context = context;

        expect(spy).toHaveBeenCalled();
        expect(view.getSize()).toEqual([20, 20]);
        context.done();
    });


}); // eof describe
}); // eof define
