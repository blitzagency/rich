define(function(require, exports, module) {

// Imports

var $ = require('jquery');
var _ = require('underscore');
var backbone = require('backbone');
var rich = require('rich');
var utils = require('rich/utils');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var matrix = require('tests/utils/matrix');
var css = require('tests/utils/css');
var matrix = require('tests/utils/matrix');
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var colors = require('tests/utils/colors').blue;
var scroll = require('rich/scrollview/scrollview');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('View Animation:', function() {
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


    xit('runs setTransform with animation', function(done){
        var color0 = new Rectangle({
            color: colors[0]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var view = new rich.View({
            constraints: [
                '|[box0(100)]|',
                'V:|[box0(100)]|',
            ]
        });
        view.box0 = box0;
        view.addSubview(box0);
        region.show(view);

        render().then(function(){
            expect(matrix.getTranslation(box0.$el)).toEqual({x: 0, y: 0, z: 0});
            wait(200).then(function(){
                expect(matrix.getTranslation(box0.$el)).not.toEqual({x: 0, y: 0, z: 0});
                expect(matrix.getTranslation(box0.$el)).not.toEqual({x: 100, y: 100, z: 0});
            });
            box0.setTransform(
                Transform.translate(100, 100, 0),
                {duration: 400}
            ).then(function(){
                expect(matrix.getTranslation(box0.$el)).toEqual({x: 100, y: 100, z: 0});
                done();
            });
        });

    });

    xit('runs setTransform without animation', function(done){
        var color0 = new Rectangle({
            color: colors[0]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var view = new rich.View({
            constraints: [
                '|[box0(100)]|',
                'V:|[box0(100)]|',
            ]
        });
        view.box0 = box0;
        view.addSubview(box0);
        region.show(view);

        render().then(function(){
            expect(matrix.getTranslation(box0.$el)).toEqual({x: 0, y: 0, z: 0});
            box0.setTransform(
                Transform.translate(100, 100, 0)
            ).then(function(){
                expect(matrix.getTranslation(box0.$el)).toEqual({x: 100, y: 100, z: 0});
                done();
            });
        });

    });

    xit('runs setOpacity with animation', function(done){
        var color0 = new Rectangle({
            color: colors[0]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var view = new rich.View({
            constraints: [
                '|[box0(100)]|',
                'V:|[box0(100)]|',
            ]
        });
        view.box0 = box0;
        view.addSubview(box0);
        region.show(view);

        render().then(function(){
            expect(box0.$el.css('opacity')).toBe('1');
            wait(200).then(function(){
                expect(box0.$el.css('opacity')).not.toBe('1');
                expect(box0.$el.css('opacity')).not.toBe('0');
            });
            box0.setOpacity(
                0,
                {duration: 400}
            ).then(function(){
                expect(box0.$el.css('opacity')).toBe('0');
                done();
            });
        });

    });

    xit('runs setOpacity without animation', function(done){
        var color0 = new Rectangle({
            color: colors[0]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var view = new rich.View({
            constraints: [
                '|[box0(100)]|',
                'V:|[box0(100)]|',
            ]
        });
        view.box0 = box0;
        view.addSubview(box0);
        region.show(view);

        render().then(function(){
            expect(box0.$el.css('opacity')).toBe('1');
            box0.setOpacity(
                0
            ).then(function(){
                expect(box0.$el.css('opacity')).toBe('0');
                done();
            });
        });

    });

    xit('runs setOrigin with animation', function(done){
        var color0 = new Rectangle({
            color: colors[0]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var view = new rich.View({
            constraints: [
                '|[box0(100)]|',
                'V:|[box0(100)]|',
            ]
        });
        view.box0 = box0;
        view.addSubview(box0);
        region.show(view);

        render().then(function(){
            expect(css.getOrigin(box0.$el)).toEqual([0, 0]);
            wait(200).then(function(){
                expect(css.getOrigin(box0.$el)).not.toEqual([0, 0]);
                expect(css.getOrigin(box0.$el)).not.toEqual([100, 100]);
            });
            box0.setOrigin(
                [1, 1],
                {duration: 400}
            ).then(function(){
                expect(css.getOrigin(box0.$el)).toEqual([100, 100]);
                done();
            });
        });

    });

    xit('runs setOrigin without animation', function(done){
        var color0 = new Rectangle({
            color: colors[0]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var view = new rich.View({
            constraints: [
                '|[box0(100)]|',
                'V:|[box0(100)]|',
            ]
        });
        view.box0 = box0;
        view.addSubview(box0);
        region.show(view);

        render().then(function(){
            expect(css.getOrigin(box0.$el)).toEqual([0, 0]);
            box0.setOrigin(
                [1, 1]
            ).then(function(){
                expect(css.getOrigin(box0.$el)).toEqual([100, 100]);
                done();
            });
        });

    });

    it('runs setAlign with animation', function(done){
        var color0 = new Rectangle({
            color: colors[0]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var view = new rich.View({
            constraints: [
                '|[box0(100)]|',
                'V:|[box0(100)]|',
            ]
        });
        view.box0 = box0;
        view.addSubview(box0);
        region.show(view);

        render().then(function(){
            expect(matrix.getTranslation(box0.$el)).toEqual({x: 0, y: 0, z: 0});
            wait(200).then(function(){
                expect(matrix.getTranslation(box0.$el)).not.toEqual({x: 0, y: 0, z: 0});
                expect(matrix.getTranslation(box0.$el)).not.toEqual({x: 100, y: 100, z: 0});
            });
            box0.setAlign(
                [1, 1],
                {duration: 400}
            ).then(function(){
                expect(matrix.getTranslation(box0.$el)).toEqual({x: 100, y: 100, z: 0});
                done();
            });
        });

    });

    it('runs setAlign with animation', function(done){
        var color0 = new Rectangle({
            color: colors[0]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var view = new rich.View({
            constraints: [
                '|[box0(100)]|',
                'V:|[box0(100)]|',
            ]
        });
        view.box0 = box0;
        view.addSubview(box0);
        region.show(view);

        render().then(function(){
            expect(matrix.getTranslation(box0.$el)).toEqual({x: 0, y: 0, z: 0});
            box0.setAlign(
                [1, 1]
            ).then(function(){
                expect(matrix.getTranslation(box0.$el)).toEqual({x: 100, y: 100, z: 0});
                done();
            });
        });

    });



}); // eof describe
}); // eof define
