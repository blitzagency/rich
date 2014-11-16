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
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var colors = require('tests/utils/colors').blue;
var scroll = require('rich/scrollview/scrollview');
var Setup = require('tests/utils/setup').Setup;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('View Animation:', function() {

    beforeEach(function() {
        loadFixtures('famous.html');

    });

    afterEach(function() {

    });

    it('triggers promise when opacity does not change', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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

        function setOpacity(value, callback){

            if(callback){
                return box0.setOpacity(value).then(callback);
            }
            return box0.setOpacity(value);
        }

        render().then(function(){
            expect(css.getOpacity(box0.$el)).not.toEqual(0);
            var spy = jasmine.createSpy();

            setOpacity(0).then(function(){
                expect(css.getOpacity(box0.$el)).toEqual(0);

                setOpacity(0, spy).then(function(){
                    expect(spy).toHaveBeenCalled();
                    expect(css.getOpacity(box0.$el)).toEqual(0);
                    done();
                });
            });
        });
    });

    xit('runs setTransform with animation', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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
                context.done();
            });
        });

    });

    xit('runs setTransform without animation', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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
                context.done();
            });
        });

    });

    xit('runs setOpacity with animation', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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
            var num = parseFloat(box0.$el.css('opacity'));
            expect(num).toBeGreaterThan(0.9999);
            wait(100).then(function(){
                expect(box0.$el.css('opacity')).not.toBe('1');
                expect(box0.$el.css('opacity')).not.toBe('0');
            });
            box0.setOpacity(
                0,
                {duration: 400}
            ).then(function(){
                expect(box0.$el.css('opacity')).toBe('0');
                context.done();
            });
        });

    });

    xit('runs setOpacity without animation', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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
            // expect(box0.$el.css('opacity')).toBe('1');
            var num = parseFloat(box0.$el.css('opacity'));
            expect(num).toBeGreaterThan(0.9999);
            box0.setOpacity(
                0
            ).then(function(){
                expect(box0.$el.css('opacity')).toBe('0');
                context.done();
            });
        });

    });

    xit('runs setOrigin with animation', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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
        var arr;
        render().then(function(){
            arr = css.getOrigin(box0.$el);
            expect(arr[0]).toEqual(0);
            expect(arr[1]).toEqual(0);
            wait(200).then(function(){
                arr = css.getOrigin(box0.$el);
                expect(arr[0]).not.toEqual(0);
                expect(arr[1]).not.toEqual(0);
                arr = css.getOrigin(box0.$el);
                expect(arr[0]).not.toEqual(100);
                expect(arr[1]).not.toEqual(100);
            });
            box0.setOrigin(
                [1, 1],
                {duration: 400}
            ).then(function(){
                arr = css.getOrigin(box0.$el);
                expect(arr[0]).toEqual(100);
                expect(arr[1]).toEqual(100);
                context.done();
            });
        });

    });

    xit('runs setOrigin without animation', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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
        var arr;
        render().then(function(){
            arr = css.getOrigin(box0.$el);
            expect(arr[0]).toEqual(0);
            expect(arr[1]).toEqual(0);
            box0.setOrigin(
                [1, 1]
            ).then(function(){
                arr = css.getOrigin(box0.$el);
                expect(arr[0]).toEqual(100);
                expect(arr[1]).toEqual(100);
                context.done();
            });
        });

    });

    xit('runs setAlign with animation', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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
                context.done();
            });
        });

    });

    xit('runs setAlign with animation', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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
                context.done();
            });
        });

    });



}); // eof describe
}); // eof define
