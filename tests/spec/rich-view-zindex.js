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

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('View+Z-Index:', function() {

    beforeEach(function() {
        loadFixtures('famous.html');

    });

    afterEach(function() {

    });


    it('uses default zIndex', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var model = new Rectangle({
            size: [300, 500],
        });

        var view = new RectangleView({model: model});

        // Must go though the Famous Context itself here,
        // we are testing for 1, if we addSubview, then
        // it would be 2.
        view.context = context.context;
        context.context.add(view);

        render().then(function(){
            // console.log(view.$el.css('z-index'))

            var value = css.getZIndex(view.$el);
            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                expect(value).toBe(0);
            } else {
                expect(value).toBe(1);
            }

            context.done();
        });
    });

    it('uses provided zIndex', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var model = new Rectangle({
            size: [300, 500],
        });

        var view = new RectangleView({model: model, zIndex: 99});
        root.addSubview(view);

        view.onShow = function(){
            var value = css.getZIndex(view.$el);

            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                expect(value).toBe(0);
            } else {
                expect(value).toBe(99);
            }

            context.done();
        };
    });

    it('adjusts zIndex if superview is greater', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var model = new Rectangle({
            size: [300, 500],
        });

        var view1 = new RectangleView({model: model, zIndex: 3});
        var view2 = new RectangleView({model: model, zIndex: 2});

        view1.addSubview(view2);
        root.addSubview(view1);

        render().then(function(){
            var value = css.getZIndex(view2.$el);

            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                expect(value).toBe(0);
            } else {
                expect(value).toBe(4);
            }

            context.done();
        });
    });

    it('forces zIndex if superview is greater', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var model = new Rectangle({
            size: [300, 500],
        });

        var view1 = new RectangleView({model: model, zIndex: 3});
        var view2 = new RectangleView({model: model, zIndex: 2});

        view1.addSubview(view2, 1);
        root.addSubview(view1);

        render().then(function(){
            var value = css.getZIndex(view2.$el);

            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                expect(value).toBe(0);
            } else {
                expect(value).toBe(1);
            }

            context.done();
        });
    });

}); // eof describe
}); // eof define
