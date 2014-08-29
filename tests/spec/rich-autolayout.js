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
var log = require('tests/utils/log');
var c = require('rich/autolayout/init').cassowary;
var autolayout = require('rich/autolayout/init');
var layoututils = require('rich/autolayout/utils');
var Setup = require('tests/utils/setup').Setup;
var constraintsWithVFL = require('rich/autolayout/constraints').constraintsWithVFL;


describe('Auto Layout + Layout:', function() {

    beforeEach(function() {
        loadFixtures('famous.html');
    });

    afterEach(function() {

    });

    it('initializes autolayout', function(){
        var context = new Setup();
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({model: model});

        root.addSubview(view);
        expect(view._autolayout).not.toBe(undefined);

        context.done();
    });

    it('adds left constraint based on parents width', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'left',
                    relatedBy: '==',
                    toItem: 'superview',
                    toAttribute: 'width',
                    multiplier: 0.25
                },
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});

        root.constraints = [].concat(c1, c2);
        root.addSubview(view);

        view.onShow = function(){
            // console.log(view._autolayout.width.value)
            // console.log(view.navigation._autolayout.left.value)
            // console.log(view.navigation._autolayout.right.value)
            // console.log('----')
            // console.log('should be 250')
            expect(view.navigation._autolayout.left.value).toBe(250);

            context.done();
        }

    });

    it('sets explicit size on subview', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();

        var view = new RectangleView({
            model: model,
        });

        view.navigation = new RectangleView({
            model:model,
            size: [100, 200]
        });

        view.addSubview(view.navigation);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([100, 200]);

            context.done();
        };
    });

    // the concept for this test is fundamentally wrong.
    it('ignores size over constraints', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview', //'null is superview'
                    toAttribute: 'width',
                    multiplier: 0.5,
                    constant: 0
                },
                {
                    item: 'navigation',
                    attribute: 'height',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview', //'null is superview'
                    toAttribute: 'height',
                    multiplier: 0.5,
                    constant: 0
                }
            ]
        });

        view.navigation = new RectangleView({
            model:model,
            size: [100, 200]
        });

        view.addSubview(view.navigation);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([500, 400]);

            context.done();
        };
    });

    it('uses constraints with superview, ==, and width', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview', //'null is superview'
                    toAttribute: 'width',
                    multiplier: 0.5,
                    constant: 0
                },
                {
                    item: 'navigation',
                    attribute: 'height',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview', //'null is superview'
                    toAttribute: 'height',
                    multiplier: 0.5,
                    constant: 0
                }
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([500, 400]);

            context.done();
        };
    });

    it('handles multiple simple constraints', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '<=', // '=|>=|<='
                    constant: 100
                },
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '>=', // '=|>=|<='
                    constant: 50
                },
                {
                    item: 'navigation',
                    attribute: 'height',
                    relatedBy: '<=', // '=|>=|<='
                    constant: 100
                },
                {
                    item: 'navigation',
                    attribute: 'height',
                    relatedBy: '>=', // '=|>=|<='
                    constant: 50
                },


            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([100, 100]);

            context.done();
        };
    });

    it('handles left simple constraint', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'left',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview',
                    toAttribute: 'left',
                    constant: 20
                },

            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation._autolayout.left.value).toBe(20);
            context.done();
        };
    });

    it('handles width simple constraint', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
    var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    constant: 80
                },
                {
                    item: 'navigation',
                    attribute: 'height',
                    relatedBy: '==', // '=|>=|<='
                    constant: 80
                },

            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){

            //log.autolayout(view.navigation, {label: 'navigation', nodes:'whtrbl'});
            expect(view.navigation._autolayout.right.value).toBe(920);
            expect(view.navigation._autolayout.left.value).toBe(0);
            expect(view.navigation._autolayout.width.value).toBe(80);

            expect(view.navigation._autolayout.bottom.value).toBe(720);
            expect(view.navigation._autolayout.top.value).toBe(0);
            expect(view.navigation._autolayout.height.value).toBe(80);

            context.done();
        };
    });

    it('handles right simple constraint', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'right',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview',
                    toAttribute: 'right',
                    constant: 80
                },
                {
                    item: 'navigation',
                    attribute: 'bottom',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview',
                    toAttribute: 'bottom',
                    constant: 80
                },

            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation._autolayout.right.value).toBe(80);
            expect(view.navigation._autolayout.left.value).toBe(0);
            expect(view.navigation._autolayout.width.value).toBe(920);

            expect(view.navigation._autolayout.bottom.value).toBe(80);
            expect(view.navigation._autolayout.top.value).toBe(0);
            expect(view.navigation._autolayout.height.value).toBe(720);

            context.done();
        };
    });

    it('handles top and bottom simple constraint', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'top',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview',
                    toAttribute: 'top',
                    constant: 80
                },
                {
                    item: 'navigation',
                    attribute: 'bottom',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview',
                    toAttribute: 'bottom',
                    constant: 80
                },
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation._autolayout.bottom.value).toBe(80);
            expect(view.navigation._autolayout.top.value).toBe(80);
            expect(view.navigation._autolayout.height.value).toBe(640);

            context.done();
        };
    });


    it('handles constraints outside of bounds of parent', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'left',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview',
                    toAttribute: 'left',
                    constant: 800
                },
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    constant: 800
                },
                {
                    item: 'navigation',
                    attribute: 'top',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview',
                    toAttribute: 'top',
                    constant: 800
                },
                {
                    item: 'navigation',
                    attribute: 'height',
                    relatedBy: '==', // '=|>=|<='
                    constant: 800
                },
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation._autolayout.left.value).toBe(800);
            expect(view.navigation._autolayout.width.value).toBe(800);
            expect(view.navigation._autolayout.right.value).toBe(-600);

            expect(view.navigation._autolayout.top.value).toBe(800);
            expect(view.navigation._autolayout.height.value).toBe(800);
            expect(view.navigation._autolayout.bottom.value).toBe(-800);

            context.done();
        };
    });

    it('handles initial constraints with width only', function(done){
        var context = new Setup(done);
        var root = context.root;

        var AltView = RectangleView.extend({
            size: [100, 0]
        });

        var color0 = new Rectangle({
            color: 'green'
        });


        AltView.prototype._render = function(){
            //debugger;
            rich.View.prototype._render.apply(this, arguments);
        };

        var view = new AltView({model: color0});

        root.constraints = [
            {
                item: view,
                attribute: 'left',
                relatedBy: '==',
                toItem: root,
                toAttribute: 'left',
                constant: 100
            }
        ];

        root.addSubview(view);


        view.onShow = function(){
            //log.autolayout(view, {label: 'view'});

            // there is no height on this, so height should be 0
            // and bottom should be 800 (aka the superview's height);

            expect(view._autolayout.width.value).toEqual(100);
            expect(view._autolayout.height.value).toEqual(0);
            expect(view._autolayout.left.value).toEqual(100);

            // left 100 + width 100 = 200, right = 1000 - 200
            expect(view._autolayout.right.value).toEqual(800);
            expect(view._autolayout.top.value).toEqual(0);
            expect(view._autolayout.bottom.value).toEqual(800);
            context.done();
        };
    });

    it('handles initial constraints with height only', function(done){
        var context = new Setup(done);
        var root = context.root;

        var AltView = RectangleView.extend({
            size: [0, 100]
        });

        var color0 = new Rectangle({
            color: 'green'
        });


        AltView.prototype._render = function(){
            //debugger;
            rich.View.prototype._render.apply(this, arguments);
        };

        var view = new AltView({model: color0});

        root.constraints = [
            {
                item: view,
                attribute: 'top',
                relatedBy: '==',
                toItem: root,
                toAttribute: 'top',
                constant: 100
            }
        ];

        root.addSubview(view);

        view.onShow = function(){
            // there is intentionally no width on this,
            // so width should be 0,
            // height should be 100,
            // right should be 1000 aka the width of the superview.
            expect(view._autolayout.width.value).toEqual(0);
            expect(view._autolayout.height.value).toEqual(100);
            expect(view._autolayout.left.value).toEqual(0);

            expect(view._autolayout.right.value).toEqual(1000);
            expect(view._autolayout.top.value).toEqual(100);

            // top 100 + height 100 = 200, bottom = 800 - 200
            expect(view._autolayout.bottom.value).toEqual(600);
            context.done();
        };
    });

    it('handles initial constraints with width and height', function(done){
        var context = new Setup(done);
        var root = context.root;

        var AltView = RectangleView.extend({
            size: [100, 100]
        });

        var color0 = new Rectangle({
            color: 'green'
        });


        AltView.prototype._render = function(){
            //debugger;
            rich.View.prototype._render.apply(this, arguments);
        };

        var view = new AltView({model: color0});

        root.constraints = [
            {
                item: view,
                attribute: 'top',
                relatedBy: '==',
                toItem: root,
                toAttribute: 'top',
                constant: 100
            },

            {
                item: view,
                attribute: 'left',
                relatedBy: '==',
                toItem: root,
                toAttribute: 'left',
                constant: 100
            }
        ];

        root.addSubview(view);

        view.onShow = function(){
            expect(view._autolayout.width.value).toEqual(100);
            expect(view._autolayout.height.value).toEqual(100);
            expect(view._autolayout.left.value).toEqual(100);

            expect(view._autolayout.right.value).toEqual(800);
            expect(view._autolayout.top.value).toEqual(100);

            // top 100 + height 100 = 200, bottom = 800 - 200
            expect(view._autolayout.bottom.value).toEqual(600);
            context.done();
        };
    });

    it('handles initial constraints with width and height and leaves horizontal', function(done){
        var context = new Setup(done);
        var root = context.root;

        var AltView = RectangleView.extend({
            size: [100, 100]
        });

        var color0 = new Rectangle({
            color: 'green'
        });

        var color1 = new Rectangle({
            color: 'red'
        });


        AltView.prototype._render = function(){
            //debugger;
            rich.View.prototype._render.apply(this, arguments);
        };

        var view1 = new AltView({model: color0});
        var view2 = new AltView({model: color1});

        root.constraints = [
            {
                item: view1,
                attribute: 'top',
                relatedBy: '==',
                toItem: root,
                toAttribute: 'top',
                constant: 100
            },

            {
                item: view1,
                attribute: 'left',
                relatedBy: '==',
                toItem: root,
                toAttribute: 'left',
                constant: 100
            },

            {
                item: view2,
                attribute: 'left',
                relatedBy: '==',
                toItem: view1,
                toAttribute: 'right',
                constant: 0
            },

            {
                item: view2,
                attribute: 'top',
                relatedBy: '==',
                toItem: view1,
                toAttribute: 'top',
                constant: 0
            }
        ];

        root.addSubview(view1);
        root.addSubview(view2);

        view1.onShow = function(){

            expect(view1._autolayout.width.value).toEqual(100);
            expect(view1._autolayout.height.value).toEqual(100);
            expect(view1._autolayout.left.value).toEqual(100);
            expect(view1._autolayout.right.value).toEqual(800);
            expect(view1._autolayout.top.value).toEqual(100);

            // top 100 + height 100 = 200, bottom = 800 - 200
            expect(view1._autolayout.bottom.value).toEqual(600);

            expect(view2._autolayout.width.value).toEqual(100);
            expect(view2._autolayout.height.value).toEqual(100);
            expect(view2._autolayout.left.value).toEqual(200);
            expect(view2._autolayout.right.value).toEqual(700);
            expect(view2._autolayout.top.value).toEqual(100);

            // top 100 + height 100 = 200, bottom = 800 - 200
            expect(view2._autolayout.bottom.value).toEqual(600);
            context.done();
        };
    });

    it('handles initial constraints with width and height and leaves vertical', function(done){
        var context = new Setup(done);

        var root = context.root;
        var region = context.region;

        var AltView = RectangleView.extend({
            size: [100, 0]
        });

        var color0 = new Rectangle({
            color: 'green'
        });

        var color1 = new Rectangle({
            color: 'red'
        });

        var color2 = new Rectangle({
            color: 'blue'
        });


        AltView.prototype._render = function(){
            //debugger;
            rich.View.prototype._render.apply(this, arguments);
        };

        var view1 = new AltView({model: color0});
        var view2 = new AltView({model: color1});
        var view3 = new AltView({model: color2});

        root.name = 'contentView';
        region.name = 'region';

        view1.name = 'view1';
        view2.name = 'view2';
        view3.name = 'view3';

        root.constraints = [

            {
                item: view1,
                attribute: 'top',
                relatedBy: '==',
                toItem: root,
                toAttribute: 'top',
                constant: 0
            },

            {
                item: view1,
                attribute: 'height',
                relatedBy: '==',
                toItem: 'superview',
                toAttribute: 'height',
            },

            {
                item: view2,
                attribute: 'top',
                relatedBy: '==',
                toItem: view1,
                toAttribute: 'bottom',
            },

            {
                item: view2,
                attribute: 'height',
                relatedBy: '==',
                toItem: 'superview',
                toAttribute: 'height',
            },

            {
                item: view3,
                attribute: 'top',
                relatedBy: '==',
                toItem: view2,
                toAttribute: 'bottom',
            },

            {
                item: view3,
                attribute: 'height',
                relatedBy: '==',
                toItem: 'superview',
                toAttribute: 'height',
            }

        ];

        root.addSubview(view1);
        root.addSubview(view2);
        root.addSubview(view3);

        root.onShow = function(){

            expect(view1._autolayout.width.value).toEqual(100);
            expect(view1._autolayout.height.value).toEqual(800);
            expect(view1._autolayout.left.value).toEqual(0);
            expect(view1._autolayout.right.value).toEqual(900);
            expect(view1._autolayout.top.value).toEqual(0);
            expect(view1._autolayout.bottom.value).toEqual(0);

            expect(view2._autolayout.width.value).toEqual(100);
            expect(view2._autolayout.height.value).toEqual(800);
            expect(view2._autolayout.left.value).toEqual(0);
            expect(view2._autolayout.right.value).toEqual(900);
            expect(view2._autolayout.top.value).toEqual(800);
            expect(view2._autolayout.bottom.value).toEqual(-800);

            expect(view3._autolayout.width.value).toEqual(100);
            expect(view3._autolayout.height.value).toEqual(800);
            expect(view3._autolayout.left.value).toEqual(0);
            expect(view3._autolayout.right.value).toEqual(900);
            expect(view3._autolayout.top.value).toEqual(1600);
            expect(view3._autolayout.bottom.value).toEqual(-1600);

            context.done();
        };
    });

    it('adds constraints based on parent', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview', //'null is superview'
                    toAttribute: 'width',
                    multiplier: 0.5,
                    constant: 40
                },
                {
                    item: 'navigation',
                    attribute: 'height',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview', //'null is superview'
                    toAttribute: 'height',
                    multiplier: 0.5,
                    constant: 40
                }
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation._autolayout.left.value).toBe(0);
            expect(view.navigation._autolayout.width.value).toBe(540);
            expect(view.navigation._autolayout.right.value).toBe(460);

            expect(view.navigation._autolayout.top.value).toBe(0);
            expect(view.navigation._autolayout.height.value).toBe(440);
            expect(view.navigation._autolayout.bottom.value).toBe(360);

            context.done();
        };
    });

    it('adds constraints based on sibling', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview', //'null is superview'
                    toAttribute: 'width',
                    multiplier: 0.5,
                    constant: -40
                },

                {
                    item: 'button',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    constant: 40
                },

                {
                    item: 'button',
                    attribute: 'left',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'navigation', //'null is superview'
                    toAttribute: 'right',
                },
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.button = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        view.addSubview(view.button);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation._autolayout.left.value).toBe(0);
            expect(view.navigation._autolayout.right.value).toBe(540);
            expect(view.navigation._autolayout.width.value).toBe(460);

            expect(view.button._autolayout.left.value).toBe(460);
            expect(view.button._autolayout.right.value).toBe(500);
            expect(view.button._autolayout.width.value).toBe(40);

            context.done();
        };

    });

    it('adds constraints based on sibling out of sequence', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview', //'null is superview'
                    toAttribute: 'width',
                    multiplier: 0.5,
                    constant: -40
                },

                {
                    item: 'button',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    constant: 40
                },

                {
                    item: 'button',
                    attribute: 'left',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'navigation', //'null is superview'
                    toAttribute: 'right',
                },

                {
                    item: 'navigation',
                    attribute: 'left',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'superview', //'null is superview'
                    toAttribute: 'left',
                    constant: 10,
                    multiplier: 1
                },
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.button = new RectangleView({
            model:model,
        });

        view.navigation.name = 'navigation';
        view.button.name = 'button';

        view.addSubview(view.navigation);
        view.addSubview(view.button);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation._autolayout.left.value).toBe(10);
            expect(view.navigation._autolayout.right.value).toBe(530);
            expect(view.navigation._autolayout.width.value).toBe(460);

            expect(view.button._autolayout.left.value).toBe(470);
            expect(view.button._autolayout.right.value).toBe(490);
            expect(view.button._autolayout.width.value).toBe(40);

            context.done();
        };

    });

    it('adds constraints based on siblings with right/right', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    constant: 100
                },

                {
                    item: 'button',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    constant: 50
                },

                {
                    item: 'navigation',
                    attribute: 'left',
                    relatedBy: '==', // '=|>=|<='
                    constant: 250,
                    multiplier: 1
                },

                {
                    item: 'button',
                    attribute: 'right',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'navigation', //'null is superview'
                    toAttribute: 'right',
                },
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.button = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        view.addSubview(view.button);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation._autolayout.left.value).toBe(250);
            expect(view.navigation._autolayout.right.value).toBe(650);
            expect(view.navigation._autolayout.width.value).toBe(100);
            expect(view.button._autolayout.left.value).toBe(300);
            expect(view.button._autolayout.right.value).toBe(650);
            expect(view.button._autolayout.width.value).toBe(50);

            context.done();
        };

    });

    it('adds constraints based on siblings with left/left', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    constant: 100
                },

                {
                    item: 'button',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    constant: 50
                },

                {
                    item: 'navigation',
                    attribute: 'left',
                    relatedBy: '==', // '=|>=|<='
                    constant: 250,
                    multiplier: 1
                },

                {
                    item: 'button',
                    attribute: 'left',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'navigation', //'null is superview'
                    toAttribute: 'left',
                },
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.button = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        view.addSubview(view.button);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation._autolayout.left.value).toBe(250);
            expect(view.navigation._autolayout.right.value).toBe(650);
            expect(view.navigation._autolayout.width.value).toBe(100);
            expect(view.button._autolayout.left.value).toBe(250);
            expect(view.button._autolayout.right.value).toBe(700);
            expect(view.button._autolayout.width.value).toBe(50);

            context.done();
        };

    });

    it('adds constraints based on siblings with bottom/bottom', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'height',
                    relatedBy: '==', // '=|>=|<='
                    constant: 100
                },

                {
                    item: 'button',
                    attribute: 'height',
                    relatedBy: '==', // '=|>=|<='
                    constant: 50
                },

                {
                    item: 'navigation',
                    attribute: 'top',
                    relatedBy: '==', // '=|>=|<='
                    constant: 250,
                    multiplier: 1
                },

                {
                    item: 'button',
                    attribute: 'bottom',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'navigation', //'null is superview'
                    toAttribute: 'bottom',
                },
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.button = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        view.addSubview(view.button);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation._autolayout.top.value).toBe(250);
            expect(view.navigation._autolayout.bottom.value).toBe(450);
            expect(view.navigation._autolayout.height.value).toBe(100);
            expect(view.button._autolayout.top.value).toBe(300);
            expect(view.button._autolayout.bottom.value).toBe(450);
            expect(view.button._autolayout.height.value).toBe(50);

            context.done();
        };

    });

    it('adds constraints based on siblings with top/top', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'height',
                    relatedBy: '==', // '=|>=|<='
                    constant: 100
                },

                {
                    item: 'button',
                    attribute: 'height',
                    relatedBy: '==', // '=|>=|<='
                    constant: 50
                },

                {
                    item: 'navigation',
                    attribute: 'top',
                    relatedBy: '==', // '=|>=|<='
                    constant: 250,
                    multiplier: 1
                },

                {
                    item: 'button',
                    attribute: 'top',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'navigation', //'null is superview'
                    toAttribute: 'top',
                },
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });
        view.button = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        view.addSubview(view.button);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation._autolayout.top.value).toBe(250);
            expect(view.navigation._autolayout.bottom.value).toBe(450);
            expect(view.navigation._autolayout.height.value).toBe(100);
            expect(view.button._autolayout.top.value).toBe(250);
            expect(view.button._autolayout.bottom.value).toBe(500);
            expect(view.button._autolayout.height.value).toBe(50);

            context.done();
        };

    });

    it('adds constraints based on siblings with left/left', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    constant: 100
                },

                {
                    item: 'button',
                    attribute: 'width',
                    relatedBy: '==', // '=|>=|<='
                    constant: 50
                },

                {
                    item: 'navigation',
                    attribute: 'right',
                    relatedBy: '==', // '=|>=|<='
                    constant: 50,
                    multiplier: 1
                },

                {
                    item: 'button',
                    attribute: 'left',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'navigation', //'null is superview'
                    toAttribute: 'left',
                },
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.button = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        view.addSubview(view.button);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation._autolayout.left.value).toBe(850);
            expect(view.navigation._autolayout.right.value).toBe(50);
            expect(view.navigation._autolayout.width.value).toBe(100);
            expect(view.button._autolayout.left.value).toBe(850);
            expect(view.button._autolayout.right.value).toBe(100);
            expect(view.button._autolayout.width.value).toBe(50);

            context.done();
        };

    });

    it('adds constraints based on siblings with top/top', function(done){
        var context = new Setup(done);
        var root = context.root;

        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'height',
                    relatedBy: '==', // '=|>=|<='
                    constant: 100
                },

                {
                    item: 'button',
                    attribute: 'height',
                    relatedBy: '==', // '=|>=|<='
                    constant: 45
                },

                {
                    item: 'navigation',
                    attribute: 'bottom',
                    relatedBy: '==', // '=|>=|<='
                    constant: 250,
                    multiplier: 1
                },

                {
                    item: 'button',
                    attribute: 'top',
                    relatedBy: '==', // '=|>=|<='
                    toItem: 'navigation', //'null is superview'
                    toAttribute: 'top',
                },
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.button = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        view.addSubview(view.button);
        root.addSubview(view);

        var c1 = constraintsWithVFL('H:|[view]|', {view: view});
        var c2 = constraintsWithVFL('V:|[view]|', {view: view});
        root.constraints = [].concat(c1, c2);

        view.onShow = function(){
            expect(view.navigation._autolayout.top.value).toBe(450);
            expect(view.navigation._autolayout.bottom.value).toBe(250);
            expect(view.navigation._autolayout.height.value).toBe(100);
            expect(view.button._autolayout.top.value).toBe(450);
            expect(view.button._autolayout.bottom.value).toBe(305);
            expect(view.button._autolayout.height.value).toBe(45);

            context.done();
        };

    });






}); // eof describe
}); // eof define
