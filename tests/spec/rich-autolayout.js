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
var Setup = require('tests/utils/setup').Setup;


describe('Auto Layout + Layout:', function() {

    beforeEach(function() {
        loadFixtures('famous.html');
    });

    afterEach(function() {

    });

    it('initializes autolayout', function(){
        var context = new Setup();

        var model = new Rectangle();
        var view = new RectangleView({model: model});

        context.region.show(view);
        expect(view._autolayout).not.toBe(undefined);

        context.done();
    });

    it('adds left constraint based on parents width', function(done){
        var context = new Setup(done);

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
        context.region.show(view);

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
        var model = new Rectangle();

        var view = new RectangleView({
            model: model,
        });

        view.navigation = new RectangleView({
            model:model,
            size: [100, 200]
        });

        view.addSubview(view.navigation);

        context.region.show(view);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([100, 200]);

            context.done();
        };
    });

    it('inherits size', function(done){
        var context = new Setup(done);
        var model = new Rectangle();

        var view = new RectangleView({
            model: model,
        });

        view.navigation = new rich.View({});
        view.addSubview(view.navigation);

        context.region.show(view);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([1000, 800]);

            context.done();
        };
    });

    // the concept for this test is fundamentally wrong.
    it('ignores size over constraints', function(done){
        var context = new Setup(done);
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
        context.region.show(view);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([500, 400]);

            context.done();
        };
    });

    it('uses constraints with superview, ==, and width', function(done){
        var context = new Setup(done);
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
        context.region.show(view);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([500, 400]);

            context.done();
        };
    });

    it('handles multiple simple constraints', function(done){
        var context = new Setup(done);
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
        context.region.show(view);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([100, 100]);

            context.done();
        };
    });

    it('handles left simple constraint', function(done){
        var context = new Setup(done);
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
        context.region.show(view);

        view.onShow = function(){
            expect(view.navigation._autolayout.left.value).toBe(20);
            context.done();
        };
    });

    it('handles width simple constraint', function(done){
        var context = new Setup(done);
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
        context.region.show(view);

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
        context.region.show(view);

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
        context.region.show(view);

        view.onShow = function(){
            expect(view.navigation._autolayout.bottom.value).toBe(80);
            expect(view.navigation._autolayout.top.value).toBe(80);
            expect(view.navigation._autolayout.height.value).toBe(640);

            context.done();
        };
    });


    it('handles constraints outside of bounds of parent', function(done){
        var context = new Setup(done);
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
        context.region.show(view);

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

    it('adds constraints based on parent', function(done){
        var context = new Setup(done);
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
        context.region.show(view);

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
        context.region.show(view);

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
        context.region.show(view);

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
        context.region.show(view);

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
        context.region.show(view);

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
        context.region.show(view);

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
        context.region.show(view);

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
        context.region.show(view);

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
        context.region.show(view);

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
