define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var utils = require('rich/utils');
var Modifier = require('famous/core/Modifier');
var Engine = require('famous/core/Engine');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var css = require('tests/utils/css');
var colors = require('tests/utils/colors').blue;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Region:', function() {
    var root;
    var region;
    var context;
    var $el;

    beforeEach(function() {
        loadFixtures('famous.html');

        root = utils.initializeRichContext({
            el: '#famous-context'
        });

        region = new rich.Region();
        root.addSubview(region);

        $el = $(root.context.container);
        context = root.context;

        expect($el.length).toBe(1);
    });

    afterEach(function() {
        utils.disposeRichContext(root);
        region = null;
        root = null;
    });


    it('view inherits size', function(done){

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        box0.onShow = function(){
            var size = css.getSize(box0.$el);
            expect(size).toEqual([1000, 800]);
            done();
        };

        region.show(box0);
    });

    it('uses constraints', function(done){

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        region.constraints = function(){
            return [
                {
                    item: box0,
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 100
                }
            ];
        };

        box0.onShow = function(){
            var size = css.getSize(box0.$el);
            expect(size).toEqual([1000, 100]);
            done();
        };

        region.show(box0);
    });

    it('swaps views', function(done){

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });


        var color1 = new Rectangle({
            color: 'red'
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        region.constraints = function(){
            return [
                {
                    item: 'currentView',
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 100
                }
            ];
        };

        render().then(function(){
            var size = css.getSize(box0.$el);
            expect(size).toEqual([1000, 100]);
            region.show(box1);
            render().then(function(){
                var size = css.getSize(box1.$el);
                expect(size).toEqual([1000, 100]);
                done();
            });
        });

        region.show(box0);
    });

    it('applies constraints to subviews children', function(done){

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });


        var color1 = new Rectangle({
            color: 'red'
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.addSubview(box1);

        render().then(function(){
            expect(box0.getSize()).toEqual([1000, 800]);
            expect(box1.getSize()).toEqual([1000, 800]);
            done();
        });

        region.show(box0);
    });

    it('applies constraints to subviews children', function(done){

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });


        var color1 = new Rectangle({
            color: 'red'
        });

        var box1 = new RectangleView({
            model: color1,
        });

        var parent = new rich.View();

        parent.addSubview(box0);
        box0.addSubview(box1);

        render().then(function(){
            expect(box0.getSize()).toEqual([1000, 800]);
            expect(box1.getSize()).toEqual([1000, 800]);
            done();
        });

        region.show(parent);
    });

    it('applies constraints to subviews children', function(done){

        var color0 = new Rectangle({
            color: colors[7]
        });

        var box0 = new RectangleView({
            model: color0,
        });


        var color1 = new Rectangle({
            color: 'red'
        });

        var box1 = new RectangleView({
            model: color1,
        });

        var parent = new rich.View({
            nestedSubviews: true
        });

        parent.addSubview(box0);
        box0.addSubview(box1);

        render().then(function(){
            expect(box0.getSize()).toEqual([1000, 800]);
            expect(box1.getSize()).toEqual([1000, 800]);
            done();
        });

        region.show(parent);
    });

}); // eof describe
}); // eof define
