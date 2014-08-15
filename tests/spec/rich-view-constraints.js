define(function(require, exports, module) {

// Imports

var $ = require('jquery');
var rich = require('rich');
var Engine = require('famous/core/Engine');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var colors = require('tests/utils/colors').blue;
var render = require('tests/utils/time').render;
var css = require('tests/utils/css');
var constraints = require('rich/autolayout/constraints');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('View + Constraints:', function() {

    var region;
    var $el;
    var context;

    beforeEach(function() {
        loadFixtures('famous.html');
        $('#jasmine-fixtures').css({height: '100%'});

        region = new rich.Region({
            el: '#famous-context'
        });


        $el = region.el;
        context = region.context;

        expect($el.length).toBe(1);
    });


    afterEach(function() {
        region.reset();
        region = null;
    });


    it('updates with constraints', function(done){
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
            done();
        };
    });

    it('updates layout after adding constraint with JSON', function(done){
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
                done();
            });
        };
    });

    it('updates layout after adding constraint with VFL', function(done){
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
                done();
            });
        };
    });

    it('removes constraint', function(done){
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

                box0.removeConstraint(c1);

                render().then(function(){
                    expect(box1._autolayout.width.value).toBe(1000);
                    expect(box1._autolayout.height.value).toBe(200);

                    box0.removeConstraint(c2);

                    render().then(function(){
                        expect(box1._autolayout.width.value).toBe(1000);
                        expect(box1._autolayout.height.value).toBe(800);
                        done();
                    });
                });

            });
        };
    });

    it('removes constraints', function(done){
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
                    done();
                });

            });
        };
    });

}); // eof describe
}); // eof define
