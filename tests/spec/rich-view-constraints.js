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
var log = require('tests/utils/log');
var constraintsWithVFL = require('rich/autolayout/constraints').constraintsWithVFL;
var constraintWithJSON = require('rich/autolayout/constraints').constraintWithJSON;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('View + Constraints:', function() {

    beforeEach(function() {
        loadFixtures('famous.html');

    });

    afterEach(function() {

    });


    xit('updates with constraints', function(done){
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
                'V:[box1(200)]',
                'H:|[box1]|'
            ]
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        box0.box1 = box1;
        box0.addSubview(box1);

        root.addSubview(box0);

        var c1 = constraintsWithVFL('H:|[view]|', {view: box0});
        var c2 = constraintsWithVFL('V:|[view]|', {view: box0});
        root.constraints = [].concat(c1, c2);

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

    xit('updates layout after adding constraint with JSON', function(done){
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
                'H:|[box1]|'
            ]
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        box0.box1 = box1;
        box0.addSubview(box1);

        root.addSubview(box0);

        var c1 = constraintsWithVFL('H:|[view]|', {view: box0});
        var c2 = constraintsWithVFL('V:|[view]|', {view: box0});
        root.constraints = [].concat(c1, c2);

        box0.onShow = function(){

            expect(box0._autolayout.left.value).toBe(0);
            expect(box0._autolayout.right.value).toBe(0);
            expect(box0._autolayout.width.value).toBe(1000);
            expect(box0._autolayout.height.value).toBe(800);

            expect(box1._autolayout.left.value).toBe(0);
            expect(box1._autolayout.right.value).toBe(0);
            expect(box1._autolayout.width.value).toBe(1000);
            expect(box1._autolayout.height.value).toBe(0);

            expect(css.getSize(box1.$el)).toEqual([1000, 0]);

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

    xit('updates layout after adding constraint with VFL', function(done){
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
                'H:|[box1]|'
            ]
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        box0.box1 = box1;
        box0.addSubview(box1);

        root.addSubview(box0);

        var c1 = constraintsWithVFL('H:|[view]|', {view: box0});
        var c2 = constraintsWithVFL('V:|[view]|', {view: box0});
        root.constraints = [].concat(c1, c2);

        box0.onShow = function(){

            expect(box0._autolayout.left.value).toBe(0);
            expect(box0._autolayout.right.value).toBe(0);
            expect(box0._autolayout.width.value).toBe(1000);
            expect(box0._autolayout.height.value).toBe(800);

            expect(box1._autolayout.left.value).toBe(0);
            expect(box1._autolayout.right.value).toBe(0);
            expect(box1._autolayout.width.value).toBe(1000);
            expect(box1._autolayout.height.value).toBe(0);

            expect(css.getSize(box1.$el)).toEqual([1000, 0]);

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

    xit('removes constraint', function(done){
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
            className: 'foo',
        });

        var box1 = new RectangleView({
            model: color1,
        });

        box0.name = 'box0';
        box1.name = 'box1';

        box0.box1 = box1;
        box0.addSubview(box1);


        root.addSubview(box0);

        var c1 = constraintsWithVFL('H:|[view]|', {view: box0});
        var c2 = constraintsWithVFL('V:|[view]|', {view: box0});
        root.constraints = [].concat(c1, c2);

        box0.onShow = function(){

            expect(box0._autolayout.left.value).toBe(0);
            expect(box0._autolayout.right.value).toBe(0);
            expect(box0._autolayout.width.value).toBe(1000);
            expect(box0._autolayout.height.value).toBe(800);

            expect(box1._autolayout.width.value).toBe(0);
            expect(box1._autolayout.height.value).toBe(0);
            expect(box1._autolayout.top.value).toBe(0);
            expect(box1._autolayout.right.value).toBe(1000);
            expect(box1._autolayout.bottom.value).toBe(800);
            expect(box1._autolayout.left.value).toBe(0);

            expect(css.getSize(box1.$el)).toEqual([0, 0]);

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
                    expect(box1._autolayout.width.value).toBe(0);
                    expect(box1._autolayout.height.value).toBe(200);

                    box0.removeConstraint(c2);

                    render().then(function(){
                        expect(box1._autolayout.width.value).toBe(0);
                        expect(box1._autolayout.height.value).toBe(0);
                        context.done();
                    });
                });

            });
        };
    });

    xit('removes constraints', function(done){
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

        root.addSubview(box0);

        var c1 = constraintsWithVFL('H:|[view]|', {view: box0});
        var c2 = constraintsWithVFL('V:|[view]|', {view: box0});
        root.constraints = [].concat(c1, c2);


        box0.onShow = function(){

            expect(box0._autolayout.left.value).toBe(0);
            expect(box0._autolayout.right.value).toBe(0);
            expect(box0._autolayout.width.value).toBe(1000);
            expect(box0._autolayout.height.value).toBe(800);

            expect(box1._autolayout.left.value).toBe(0);
            expect(box1._autolayout.right.value).toBe(1000);
            expect(box1._autolayout.width.value).toBe(0);
            expect(box1._autolayout.height.value).toBe(0);
            expect(box1._autolayout.bottom.value).toBe(800);

            expect(css.getSize(box1.$el)).toEqual([0, 0]);

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
                    expect(box1._autolayout.width.value).toBe(0);
                    expect(box1._autolayout.height.value).toBe(0);
                    context.done();
                });

            });
        };
    });

    it('fills parent view using fillWithSubview', function(done){
        var context = new Setup(done);

        var root = context.root;

        var color0 = new Rectangle({
            color: colors[0]
        });

        var view = new RectangleView({
            model: color0,
        });

        root.fillWithSubview(view);

        view.onShow = function(){
            expect(view._autolayout.left.value).toBe(0);
            expect(view._autolayout.right.value).toBe(0);
            expect(view._autolayout.width.value).toBe(1000);
            expect(view._autolayout.height.value).toBe(800);
            context.done();
        };

    });

    it('fills parent view using fillWithSubview after render', function(done){
        var context = new Setup(done);

        var root = context.root;

        var color0 = new Rectangle({
            color: colors[0]
        });

        var view = new RectangleView({
            model: color0,
        });

        render().then(function(){
            root.fillWithSubview(view);

            view.onShow = function(){
                expect(view._autolayout.left.value).toBe(0);
                expect(view._autolayout.right.value).toBe(0);
                expect(view._autolayout.width.value).toBe(1000);
                expect(view._autolayout.height.value).toBe(800);
                context.done();
            };
        });

    });

    it('adds constraint with no root', function(done){
        var context = new Setup(done);

        var root = context.root;

        var color0 = new Rectangle({
            color: colors[0]
        });

        var view1 = new RectangleView({
            model: color0,
        });

        root.addSubview(view1);
        root.addConstraint(constraintWithJSON({
            item: view1,
            attribute: 'width',
            relatedBy: '==',
            constant: 50
        }));

        root.addConstraint(constraintWithJSON({
            item: view1,
            attribute: 'height',
            relatedBy: '==',
            constant: 75
        }));

        view1.onShow = function(){
            expect(view1._autolayout.left.value).toBe(0);
            expect(view1._autolayout.width.value).toBe(50);
            expect(view1._autolayout.height.value).toBe(75);
            context.done();
        };
    });

    it('adds constraint(s) with no root', function(done){
        var context = new Setup(done);

        var root = context.root;

        var color0 = new Rectangle({
            color: colors[0]
        });

        var view0 = new RectangleView({
            model: color0,
        });

        var c1 = constraintWithJSON({
            item: view0,
            attribute: 'width',
            relatedBy: '==',
            constant: 50
        });

        var c2 = constraintWithJSON({
            item: view0,
            attribute: 'height',
            relatedBy: '==',
            constant: 75
        });

        root.addSubview(view0);
        root.addConstraints([c1, c2]);

        view0.onShow = function(){
            expect(view0._autolayout.left.value).toBe(0);
            expect(view0._autolayout.width.value).toBe(50);
            expect(view0._autolayout.height.value).toBe(75);
            context.done();
        };
    });

    it('calls onConstraintsReset', function(done){
        var context = new Setup(done);
        var root = context.root;
        var swap = false;

        var color0 = new Rectangle({
            color: colors[7]
        });

        var color1 = new Rectangle({
            color: colors[0]
        });

        // intentionally created first, as we need it below.
        var view1 = new RectangleView({
            model: color1,
        });

        var view0 = new RectangleView({
            model: color0,
            constraints: function(){
                if(!swap) {
                    return [];
                } else {
                    return [
                        {
                            item: view1,
                            attribute: 'width',
                            relatedBy: '==',
                            constant: 50
                        }
                    ];
                }
            }
        });

        view0.onConstraintsReset = function(){ /*noop*/}.bind(view0);
        spyOn(view0, 'onConstraintsReset');

        var c1 = constraintWithJSON({
            item: view0,
            attribute: 'width',
            relatedBy: '==',
            constant: 100
        });

        var c2 = constraintWithJSON({
            item: view0,
            attribute: 'height',
            relatedBy: '==',
            constant: 100
        });

        view0.name = 'view0';
        view1.name = 'view1';
        view0.addSubview(view1);
        root.addSubview(view0);
        root.addConstraints([c1, c2]);

        view0.onShow = function(){
            swap = true;

            expect(view0.onConstraintsReset).not.toHaveBeenCalled();

            expect(view0._autolayout.left.value).toBe(0);
            expect(view0._autolayout.width.value).toBe(100);
            expect(view0._autolayout.height.value).toBe(100);

            expect(view1._autolayout.left.value).toBe(0);
            expect(view1._autolayout.width.value).toBe(0);

            root.invalidateLayout();
            render().then(function(){
                expect(view0.onConstraintsReset).toHaveBeenCalled();

                expect(view1._autolayout.left.value).toBe(0);
                expect(view1._autolayout.width.value).toBe(50);
                context.done();
            });
        };
    });

    xit('removes constraints when subview is removed', function(done){
        var context = new Setup(done);

        var root = context.root;

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var view1 = new RectangleView({
            model: color0,
        });

        var view2 = new RectangleView({
            model: color0,
        });


        var c1 = constraintWithJSON({
            item: view1,
            attribute: 'width',
            relatedBy: '==',
            constant: 50
        });

        var c2 = constraintWithJSON({
            item: view1,
            attribute: 'width',
            relatedBy: '==',
            constant: 50
        });

        var c3 = constraintWithJSON({
            item: view2,
            attribute: 'width',
            relatedBy: '==',
            constant: 50
        });

        var c4 = constraintWithJSON({
            item: view2,
            attribute: 'width',
            relatedBy: '==',
            constant: 50
        });

        root.addSubview(view1);
        root.addSubview(view2);
        // debugger;
        root.addConstraints([c1, c2, c3, c4]);

        render().then(function(){
            expect(root.getConstraints().length).toEqual(4);
            context.done();
            // view.onShow = function(){
            //     expect(view._autolayout.left.value).toBe(0);
            //     expect(view._autolayout.right.value).toBe(0);
            //     expect(view._autolayout.width.value).toBe(1000);
            //     expect(view._autolayout.height.value).toBe(800);
            //     context.done();
            // };
        });
    });

}); // eof describe
}); // eof define
