define(function(require, exports, module) {

// Imports

var $ = require('jquery');
var rich = require('rich');
var utils = require('rich/utils');
var Engine = require('famous/core/Engine');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var colors = require('tests/utils/colors').blue;
var render = require('tests/utils/time').render;
var css = require('tests/utils/css');
var constraints = require('rich/autolayout/constraints');
var Setup = require('tests/utils/setup').Setup;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('View + Constraints:', function() {

    beforeEach(function() {
        loadFixtures('famous.html');

    });

    afterEach(function() {

    });


    it('updates with constraints', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: 'red'
        });

        var box0 = new RectangleView({
            model: color0,
            constraints: [
                'V:[box1(200)]'
            ]
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        box0.box1 = box1;
        box0.addSubview(box1);

        region.show(box0);
        box0.onShow = function(){

            expect(box0._autolayout.left.value).toBe(0);
            expect(box0._autolayout.right.value).toBe(0);
            expect(box0._autolayout.width.value).toBe(1000);
            expect(box0._autolayout.height.value).toBe(800);

            expect(box1._autolayout.left.value).toBe(0);
            expect(box1._autolayout.right.value).toBe(0);
            expect(box1._autolayout.width.value).toBe(1000);
            expect(box1._autolayout.height.value).toBe(200);
            expect(box1._autolayout.bottom.value).toBe(600);

            expect(css.getSize(box1.$el)).toEqual([1000, 200]);
            context.done();
        };
    });

    it('updates layout after adding constraint with JSON', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: 'red'
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        box0.box1 = box1;
        box0.addSubview(box1);

        region.show(box0);

        box0.onShow = function(){

            expect(box0._autolayout.left.value).toBe(0);
            expect(box0._autolayout.right.value).toBe(0);
            expect(box0._autolayout.width.value).toBe(1000);
            expect(box0._autolayout.height.value).toBe(800);

            expect(box1._autolayout.left.value).toBe(0);
            expect(box1._autolayout.right.value).toBe(0);
            expect(box1._autolayout.width.value).toBe(1000);
            expect(box1._autolayout.height.value).toBe(800);

            expect(css.getSize(box1.$el)).toEqual([1000, 800]);

            var c = constraints.constraintWithJSON({
                item: box1,
                attribute: 'height',
                relatedBy: '==',
                constant: 200
            });

            box0.addConstraint(c);

            render().then(function(){
                expect(box1._autolayout.height.value).toBe(200);
                expect(box1._autolayout.bottom.value).toBe(600);
                expect(css.getSize(box1.$el)).toEqual([1000, 200]);
                context.done();
            });
        };
    });

    it('updates layout after adding constraint with VFL', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: 'red'
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        box0.box1 = box1;
        box0.addSubview(box1);

        region.show(box0);

        box0.onShow = function(){

            expect(box0._autolayout.left.value).toBe(0);
            expect(box0._autolayout.right.value).toBe(0);
            expect(box0._autolayout.width.value).toBe(1000);
            expect(box0._autolayout.height.value).toBe(800);

            expect(box1._autolayout.left.value).toBe(0);
            expect(box1._autolayout.right.value).toBe(0);
            expect(box1._autolayout.width.value).toBe(1000);
            expect(box1._autolayout.height.value).toBe(800);

            expect(css.getSize(box1.$el)).toEqual([1000, 800]);

            var c = constraints.constraintsWithVFL('V:[box1(200)]');

            box0.addConstraints(c);

            render().then(function(){
                expect(box1._autolayout.height.value).toBe(200);
                expect(box1._autolayout.bottom.value).toBe(600);
                expect(css.getSize(box1.$el)).toEqual([1000, 200]);
                context.done();
            });
        };
    });

    it('removes constraint', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: 'red'
        });

        var box0 = new RectangleView({
            model: color0,
            className: 'foo'
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        box0.box1 = box1;
        box0.addSubview(box1);


        region.show(box0);


        box0.onShow = function(){

            expect(box0._autolayout.left.value).toBe(0);
            expect(box0._autolayout.right.value).toBe(0);
            expect(box0._autolayout.width.value).toBe(1000);
            expect(box0._autolayout.height.value).toBe(800);

            expect(box1._autolayout.left.value).toBe(0);
            expect(box1._autolayout.right.value).toBe(0);
            expect(box1._autolayout.width.value).toBe(1000);
            expect(box1._autolayout.height.value).toBe(800);

            expect(css.getSize(box1.$el)).toEqual([1000, 800]);

            var c1 = constraints.constraintWithJSON({
                item: box1,
                attribute: 'width',
                relatedBy: '==',
                constant: 500
            });

            var c2 = constraints.constraintWithJSON({
                item: box1,
                attribute: 'height',
                relatedBy: '==',
                constant: 200
            });

            box0.addConstraints([c1, c2]);
            render().then(function(){

                expect(box1._autolayout.width.value).toBe(500);
                expect(box1._autolayout.height.value).toBe(200);
                expect(box1._autolayout.bottom.value).toBe(600);
                expect(css.getSize(box1.$el)).toEqual([500, 200]);

                box0.removeConstraint(c1);

                render().then(function(){
                    expect(box1._autolayout.width.value).toBe(1000);
                    expect(box1._autolayout.height.value).toBe(200);

                    box0.removeConstraint(c2);

                    render().then(function(){
                        expect(box1._autolayout.width.value).toBe(1000);
                        expect(box1._autolayout.height.value).toBe(800);
                        context.done();
                    });
                });

            });
        };
    });

    it('removes constraints', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: 'red'
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        box0.box1 = box1;
        box0.addSubview(box1);

        region.show(box0);


        box0.onShow = function(){

            expect(box0._autolayout.left.value).toBe(0);
            expect(box0._autolayout.right.value).toBe(0);
            expect(box0._autolayout.width.value).toBe(1000);
            expect(box0._autolayout.height.value).toBe(800);

            expect(box1._autolayout.left.value).toBe(0);
            expect(box1._autolayout.right.value).toBe(0);
            expect(box1._autolayout.width.value).toBe(1000);
            expect(box1._autolayout.height.value).toBe(800);

            expect(css.getSize(box1.$el)).toEqual([1000, 800]);

            var c1 = constraints.constraintWithJSON({
                item: box1,
                attribute: 'width',
                relatedBy: '==',
                constant: 500
            });

            var c2 = constraints.constraintWithJSON({
                item: box1,
                attribute: 'height',
                relatedBy: '==',
                constant: 200
            });

            box0.addConstraints([c1, c2]);

            render().then(function(){
                expect(box1._autolayout.width.value).toBe(500);
                expect(box1._autolayout.height.value).toBe(200);
                expect(box1._autolayout.bottom.value).toBe(600);
                expect(css.getSize(box1.$el)).toEqual([500, 200]);

                box0.removeConstraints([c1, c2]);

                render().then(function(){
                    expect(box1._autolayout.width.value).toBe(1000);
                    expect(box1._autolayout.height.value).toBe(800);
                    context.done();
                });

            });
        };
    });

}); // eof describe
}); // eof define
