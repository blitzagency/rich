define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var utils = require('rich/utils');
var Modifier = require('famous/core/Modifier');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var colors = require('tests/utils/colors').blue;
var c = require('rich/autolayout/init').cassowary;
var autolayout = require('rich/autolayout/init');
var layoututils = require('rich/autolayout/utils');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Auto Layout:', function() {
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


    it('generates layout modifiers', function(done){
        var model = new Rectangle({
            color: 'red'
        });

        var view = new rich.View({
            model: model,
            constraints: [

                {
                    item: 'navigation',
                    attribute: 'left',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview',
                    toAttribute: 'top',
                    constant: 10,
                },

                {
                    item: 'navigation',
                    attribute: 'right',
                    relatedBy: '==', // '=|>=|<='
                    toItem:'superview',
                    toAttribute: 'width',
                    constant: 0,
                    multiplier: 0.5
                },

                {
                    item: 'navigation',
                    attribute: 'top',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview',
                    toAttribute: 'top',
                    constant: 5,
                    multiplier: 1
                },
            ]
        });

        view.navigation = new RectangleView({
            model:model
        });

        view.addSubview(view.navigation);
        region.show(view);

        view.setSize([200, 200]);

        view.onShow = function(){

            expect(view._autolayout.width.value).toBe(200);
            expect(view._autolayout.height.value).toBe(200);

            expect(view.navigation._autolayout.top.value).toBe(5);
            expect(view.navigation._autolayout.height.value).toBe(195);
            expect(view.navigation._autolayout.width.value).toBe(90);
            expect(view.navigation._autolayout.left.value).toBe(10);
            done();
        };

    });

    xit('cassowary test', function(done){
        var w = 0;
        var h = 0;
        var box0;
        var box1;
        var box2;
        var viewport;

        function initializeAutoLayout(obj){

        }

        function initializeRelationships(obj){
            console.log('_initializeRelationships -> ' + obj.name);
            var solver = obj.solver = new c.SimplexSolver();
            var superview = obj.superview._autolayout;

            var top = autolayout.geq(obj._autolayout.top, 0, autolayout.weak, 1);
            var right = autolayout.geq(obj._autolayout.right, 0, autolayout.weak, 1);
            var bottom = autolayout.geq(obj._autolayout.bottom, 0, autolayout.weak, 1);
            var left = autolayout.geq(obj._autolayout.left, 0, autolayout.weak, 1);
            var pullLeft = autolayout.eq(obj._autolayout.left, 0, autolayout.weak, 1);
            var pullTop = autolayout.eq(obj._autolayout.top, 0, autolayout.weak, 1);

            solver.addStay(obj._autolayout.width, autolayout.weak, 0);
            solver.addStay(obj._autolayout.height, autolayout.weak, 0);

            solver.addConstraint(pullLeft);
            solver.addConstraint(pullTop);
            solver.addConstraint(left);
            solver.addConstraint(top);
            solver.addConstraint(right);
            solver.addConstraint(bottom);

            if(superview.right)
                solver.addStay(superview.right, autolayout.weak);

            if(superview.left)
                solver.addStay(superview.left, autolayout.weak);

            if(superview.width)
                solver.addStay(superview.width, autolayout.weak);

            if(superview.height)
                solver.addStay(superview.height, autolayout.weak);

            if(superview.top)
                solver.addStay(superview.top, autolayout.weak);

            if(superview.bottom)
                solver.addStay(superview.bottom, autolayout.weak);

            // No explicit size is set:
            solver.addEditVar(obj._autolayout.width);
            solver.addEditVar(obj._autolayout.height);
            solver.beginEdit();
            solver.suggestValue(obj._autolayout.width, superview.width.value);
            solver.suggestValue(obj._autolayout.height, superview.height.value);
            solver.resolve();
            solver.endEdit();

            solver.addConstraint(
                autolayout.eq(
                    autolayout.plus(obj._autolayout.width, obj._autolayout.right).plus(obj._autolayout.left),
                    superview.width,
                    autolayout.weak, 0)
            );

            solver.addConstraint(
                autolayout.eq(
                    autolayout.plus(obj._autolayout.height, obj._autolayout.bottom).plus(obj._autolayout.top),
                    superview.height,
                    autolayout.weak, 0)
            );

            solver.resolve();
        }

        function constraintsFromJson(list, view){
            var data = [];
            _.each(list, function(each){
                data.push(layoututils.constraintsFromJson(each, view));
            });

            return data;
        }

        function applyConstraints(json, onView, toView){
            console.log('Adding constraints[' + json.length +'] for -> ' + onView.name);
            _.each(constraintsFromJson(json, onView), function(cn){
                _.each(cn.stays, function(stay){
                    toView.solver.addStay(stay, autolayout.weak, 10);
                });

                toView.solver.addConstraint(cn.constraint);
            });
        }

        viewport = {
             _autolayout: {
                width: autolayout.cv('width', 1000),
                height: autolayout.cv('width', 800),
            }
        };

        box0 = {
            _autolayout: {
                width: autolayout.cv('width', w),
                height: autolayout.cv('height', h),
                top: autolayout.cv('top', 0),
                right: autolayout.cv('right', 0),
                bottom: autolayout.cv('bottom', 0),
                left: autolayout.cv('left', 0),
            }
        };

        box1 = {
            _autolayout: {
                width: autolayout.cv('width', w),
                height: autolayout.cv('height', h),
                top: autolayout.cv('top', 0),
                right: autolayout.cv('right', 0),
                bottom: autolayout.cv('bottom', 0),
                left: autolayout.cv('left', 0),
            }
        };

        box2 = {
            _autolayout: {
                width: autolayout.cv('width', w),
                height: autolayout.cv('height', h),
                top: autolayout.cv('top', 0),
                right: autolayout.cv('right', 0),
                bottom: autolayout.cv('bottom', 0),
                left: autolayout.cv('left', 0),
            }
        };



        viewport.name = 'regionView';
        box0.name = 'box0';
        box1.name = 'box1';
        box2.name = 'box2';

        box0.superview = viewport;
        box1.superview = box0;
        box2.superview = box1;

        box0.box1 = box1;
        box1.box2 = box2;

        initializeAutoLayout(box0);
        initializeAutoLayout(box1);
        initializeAutoLayout(box2);

        initializeRelationships(box0);
        initializeRelationships(box1);
        initializeRelationships(box2);

        var cn0 = [
            {
                item: 'box1',
                attribute: 'bottom',
                relatedBy: '==',
                toItem: 'superview',
                toAttribute: 'bottom',
                constant: 0
            },

            {
                item: 'box1',
                attribute: 'height',
                relatedBy: '==',
                constant: 200
            }
        ];

        var cn1 = [
            {
                item: 'box2',
                attribute: 'bottom',
                relatedBy: '==',
                toItem: 'superview',
                toAttribute: 'bottom',
                constant: 0
            },
        ];

        applyConstraints(cn0, box0, box1);
        applyConstraints(cn1, box1, box2);

        console.log('(box0) L:' + box0._autolayout.left.value);
        console.log('(box0) R:' + box0._autolayout.right.value);
        console.log('(box0) W:' + box0._autolayout.width.value);
        console.log('(box0) H:' + box0._autolayout.height.value);
        console.log('---');

        console.log('(box1) L:' + box1._autolayout.left.value);
        console.log('(box1) R:' + box1._autolayout.right.value);
        console.log('(box1) W:' + box1._autolayout.width.value);
        console.log('(box1) H:' + box1._autolayout.height.value);
        console.log('(box1) T:' + box1._autolayout.top.value);
        console.log('(box1) B:' + box1._autolayout.bottom.value);
        console.log('---');

        console.log('(box2) L:' + box2._autolayout.left.value);
        console.log('(box2) R:' + box2._autolayout.right.value);
        console.log('(box2) W:' + box2._autolayout.width.value);
        console.log('(box2) H:' + box2._autolayout.height.value);
        console.log('---');


        done();
    });

    it('generates complex layout modifiers', function(done){
        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var color2 = new Rectangle({
            color: colors[2]
        });

        var box0 = new RectangleView({
            model: color0,
            constraints: [
                {
                    item: 'box1',
                    attribute: 'bottom',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'bottom',
                    constant: 0
                },

                {
                    item: 'box1',
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 200
                }
            ]
        });

        var box1 = new RectangleView({
            model: color1,
            constraints: [
                {
                    item: 'box2',
                    attribute: 'bottom',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'bottom',
                    constant: 0
                },
            ]
        });

        var box2 = new RectangleView({
            model: color2,
        });

        box0.name = 'box0';
        box1.name = 'box1';
        box2.name = 'box2';

        box0.box1 = box1;
        box0.addSubview(box1);

        box1.box2 = box2;
        box1.addSubview(box2);

        region.show(box0);

        box0.onShow = function(){
            expect(box0._autolayout.left.value).toEqual(0);
            expect(box0._autolayout.right.value).toEqual(0);
            expect(box0._autolayout.width.value).toEqual(1000);
            expect(box0._autolayout.height.value).toEqual(800);

            expect(box1._autolayout.left.value).toEqual(0);
            expect(box1._autolayout.right.value).toEqual(0);
            expect(box1._autolayout.width.value).toEqual(1000);
            expect(box1._autolayout.height.value).toEqual(200);
            expect(box1._autolayout.top.value).toEqual(600);
            expect(box1._autolayout.bottom.value).toEqual(0);

            expect(box2._autolayout.left.value).toEqual(0);
            expect(box2._autolayout.right.value).toEqual(0);
            expect(box2._autolayout.width.value).toEqual(1000);
            expect(box2._autolayout.height.value).toEqual(200);
            expect(box2._autolayout.top.value).toEqual(0);
            expect(box2._autolayout.bottom.value).toEqual(0);

            done();
        };

    });

    it('generates common app layout', function(done){

        var autolayoutTransition = {
            duration: 500
        };

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var color2 = new Rectangle({
            color: colors[2]
        });

        var color3 = new Rectangle({
            color: colors[3]
        });

        var color4 = new Rectangle({
            color: colors[4]
        });

        var color5 = new Rectangle({
            color: colors[5]
        });

        var gray = new Rectangle({
            color: '#ccc'
        });

        var view = new rich.View({
            autolayoutTransition: autolayoutTransition,
            constraints: [
                {
                    item: 'column',
                    attribute: 'width',
                    relatedBy: '==',
                    constant: 200
                },

                {
                    item: 'column',
                    attribute: 'left',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'left',
                    constant: 0
                },

                {
                    item: 'content',
                    attribute: 'left',
                    relatedBy: '==',
                    toItem: 'column',
                    toAttribute: 'right',
                    constant: 0
                },
            ]
        });

        var column = new RectangleView({
            model: color0,
            autolayoutTransition: autolayoutTransition,
            constraints: [
                {
                    item: 'action1',
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 50
                },

                {
                    item: 'action1',
                    attribute: 'width',
                    relatedBy: '==',
                    constant: 50
                },

                {
                    item: 'action1',
                    attribute: 'right',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'right',
                    constant: 0
                },

                {
                    item: 'footer',
                    attribute: 'bottom',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'bottom',
                    constant: 0
                },

                {
                    item: 'footer',
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 50
                },

                {
                    item: 'footer',
                    attribute: 'width',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'width',
                },
            ]
        });

        var footer = new RectangleView({
            model: color1,
            autolayoutTransition: autolayoutTransition,
            constraints: [

                {
                    item: 'action2',
                    attribute: 'width',
                    relatedBy: '==',
                    constant: 50
                },

                {
                    item: 'action2',
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 50
                },

                {
                    item: 'action2',
                    attribute: 'right',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'right',
                    constant: 0
                },


                {
                    item: 'action3',
                    attribute: 'width',
                    relatedBy: '==',
                    constant: 50
                },

                {
                    item: 'action3',
                    attribute: 'height',
                    relatedBy: '==',
                    constant: 50
                },

                {
                    item: 'action3',
                    attribute: 'right',
                    relatedBy: '==',
                    toItem: 'action2',
                    toAttribute: 'left',
                    constant: 10
                },


            ]
        });

        var content = new RectangleView({
            model: gray,
            autolayoutTransition: autolayoutTransition
        });

        var action1 = new RectangleView({
            model: color3
        });

        var action2 = new RectangleView({
            model: color4
        });

        var action3 = new RectangleView({
            model: color4,
            autolayoutTransition: autolayoutTransition,
            constraints: [
                // {
                //     item: 'action4',
                //     attribute: 'top',
                //     relatedBy: '==',
                //     constant: 0
                // },
                {
                    item: 'action4',
                    attribute: 'height',
                    relatedBy: '==',
                    // toItem: 'action2',
                    // toAttribute: 'left',
                    constant: 10
                },
                {
                    item: 'action4',
                    attribute: 'width',
                    relatedBy: '==',
                    // toItem: 'action2',
                    // toAttribute: 'left',
                    constant: 10
                },

                {
                    item: 'action4',
                    attribute: 'right',
                    relatedBy: '==',
                    // toItem: 'action2',
                    // toAttribute: 'left',
                    constant: 0
                },
                {
                    item: 'action4',
                    attribute: 'bottom',
                    relatedBy: '==',
                    // toItem: 'action2',
                    // toAttribute: 'left',
                    constant: 0
                }
            ]
        });

        var action4 = new RectangleView({
            model: color2
        });

        action1.name = 'action1';
        action2.name = 'action2';
        action3.name = 'action3';
        action4.name = 'action4';


        footer.name = 'footer';
        column.name = 'column';
        view.name = 'view';
        content.name = 'content';

        view.column = column;
        view.content = content;
        view.addSubview(column);
        view.addSubview(content);

        column.action1 = action1;
        column.addSubview(action1);

        column.footer = footer;
        column.addSubview(footer);

        footer.action2 = action2;
        footer.addSubview(action2, 3);

        footer.action3 = action3;
        footer.addSubview(action3, 3);

        action3.action4 = action4;
        action3.addSubview(action4);

        region.show(view);

        //view.setSize([1000, 400]);
        function logValues(){
            console.log('-- rich-autolayout-modifiers.js [Line 677]');
            console.log('(content) L:' + content._autolayout.left.value);
            console.log('(content) R:' + content._autolayout.right.value);
            console.log('(content) W:' + content._autolayout.width.value);
            console.log('(content) H:' + content._autolayout.height.value);

            console.log('---');

            console.log('(column) L:' + column._autolayout.left.value);
            console.log('(column) R:' + column._autolayout.right.value);
            console.log('(column) W:' + column._autolayout.width.value);
            console.log('(column) H:' + column._autolayout.height.value);

            console.log('---');

            console.log('(footer) L:' + footer._autolayout.left.value);
            console.log('(footer) R:' + footer._autolayout.right.value);
            console.log('(footer) W:' + footer._autolayout.width.value);
            console.log('(footer) H:' + footer._autolayout.height.value);
            console.log('(footer) T:' + footer._autolayout.top.value);

            console.log('---');

            console.log('(action1) L:' + action1._autolayout.left.value);
            console.log('(action1) R:' + action1._autolayout.right.value);
            console.log('(action1) W:' + action1._autolayout.width.value);

            console.log('---');

            console.log('(action2) L:' + action2._autolayout.left.value);
            console.log('(action2) R:' + action2._autolayout.right.value);
            console.log('(action2) W:' + action2._autolayout.width.value);
            console.log('---');

            console.log('(action3) L:' + action3._autolayout.left.value);
            console.log('(action3) R:' + action3._autolayout.right.value);

            console.log('---');

            console.log('(action4) L:' + action4._autolayout.left.value);
            console.log('(action4) R:' + action4._autolayout.right.value);
            console.log('(action4) T:' + action4._autolayout.top.value);
            console.log('(action4) W:' + action4._autolayout.width.value);
            console.log('(action4) H:' + action4._autolayout.height.value);
        }

        view.onShow = function(){
            //logValues();

            expect(content._autolayout.left.value).toEqual(200);
            expect(content._autolayout.right.value).toEqual(0);
            expect(content._autolayout.width.value).toEqual(800);
            expect(content._autolayout.height.value).toEqual(800);

            expect(column._autolayout.left.value).toEqual(0);
            expect(column._autolayout.right.value).toEqual(800);
            expect(column._autolayout.width.value).toEqual(200);
            expect(column._autolayout.height.value).toEqual(800);

            expect(footer._autolayout.left.value).toEqual(0);
            expect(footer._autolayout.right.value).toEqual(0);
            expect(footer._autolayout.width.value).toEqual(200);
            expect(footer._autolayout.height.value).toEqual(50);
            expect(footer._autolayout.top.value).toEqual(750);
            expect(footer._autolayout.bottom.value).toEqual(0);

            expect(action1._autolayout.left.value).toEqual(150);
            expect(action1._autolayout.right.value).toEqual(0);
            expect(action1._autolayout.width.value).toEqual(50);
            expect(action1._autolayout.height.value).toEqual(50);
            expect(action1._autolayout.top.value).toEqual(0);
            expect(action1._autolayout.bottom.value).toEqual(750);

            expect(action2._autolayout.left.value).toEqual(150);
            expect(action2._autolayout.right.value).toEqual(0);
            expect(action2._autolayout.width.value).toEqual(50);
            expect(action2._autolayout.height.value).toEqual(50);
            expect(action2._autolayout.top.value).toEqual(0);
            expect(action2._autolayout.bottom.value).toEqual(0);

            expect(action3._autolayout.left.value).toEqual(90);
            expect(action3._autolayout.right.value).toEqual(60);
            expect(action3._autolayout.width.value).toEqual(50);
            expect(action3._autolayout.height.value).toEqual(50);
            expect(action3._autolayout.top.value).toEqual(0);
            expect(action3._autolayout.bottom.value).toEqual(0);

            expect(action4._autolayout.left.value).toEqual(40);
            expect(action4._autolayout.right.value).toEqual(0);
            expect(action4._autolayout.width.value).toEqual(10);
            expect(action4._autolayout.height.value).toEqual(10);
            expect(action4._autolayout.top.value).toEqual(40);
            expect(action4._autolayout.bottom.value).toEqual(0);

            done();
        };
    });


}); // eof describe
}); // eof define
