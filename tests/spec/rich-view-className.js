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

describe('View+ClassName:', function() {

    beforeEach(function() {
        loadFixtures('famous.html');

    });

    afterEach(function() {

    });


    it('uses className', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var model = new Rectangle({
            size: [300, 500]
        });

        var view = new RectangleView({model: model, className: 'foo'});
        view.context = context;

        context.context.add(view);

        render().then(function(){
            expect(view.$el.hasClass('foo')).toBe(true);
            context.done();
        });
    });


    it('uses className as function', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var model = new Rectangle({
            size: [300, 500],
        });

        var className = function(){
            return 'bar';
        };

        var view = new RectangleView({model: model, className: className});
        view.context = context;

        context.context.add(view);

        view.onShow = function(){
            expect(view.$el.hasClass('bar')).toBe(true);
            context.done();
        };
    });

}); // eof describe
}); // eof define
