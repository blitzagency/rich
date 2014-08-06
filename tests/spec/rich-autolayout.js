define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var render = require('tests/utils/time').render;
var colors = require('tests/utils/colors').blue;



describe('Auto Layout:', function() {
    var region;
    var $el;

    beforeEach(function() {
        loadFixtures('famous.html');

        region = new rich.Region({
            el: '#famous-context'
        });

        $el = region.el;
        expect($el.length).toBe(1);
    });

    afterEach(function() {
        region.reset();
        region = null;
    });


    xit('initializes autolayout', function(){
        var model = new Rectangle();
        var view = new RectangleView({model: model});
        region.show(view);
        expect(view._autolayout).not.toBe(undefined);
    });

    xit('sets explicit size on subview', function(done){
        var model = new Rectangle();

        var view = new RectangleView({
            model: model,
        });
        view.navigation = new RectangleView({
            model:model,
            size: [100, 200]
        });
        view.addSubview(view.navigation);
        region.show(view);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([100, 200]);
            done();
        };
    });

    xit('inherits size', function(done){
        var model = new Rectangle();

        var view = new RectangleView({
            model: model,
        });
        view.navigation = new rich.View({});
        view.addSubview(view.navigation);

        region.show(view);
        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([1000, 800]);
            done();
        };
    });

    xit('ignores constraints over explicit size', function(done){
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
        region.show(view);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([100, 200]);
            done();
        };
    });

    xit('uses constraints with superview, ==, and width', function(done){
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
        region.show(view);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([500, 400]);
            done();
        };
    });

    xit('handles multiple simple constraints', function(done){
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
        region.show(view);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([100, 100]);
            done();
        };
    });

    xit('handles left simple constraint', function(done){
        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'left',
                    relatedBy: '==', // '=|>=|<='
                    constant: 20
                },

            ]
        });
        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        region.show(view);

        view.onShow = function(){
            expect(view.navigation._autolayout.left.value).toBe(20);
            done();
        };
    });

    xit('handles width simple constraint', function(done){
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
        region.show(view);

        view.onShow = function(){
            expect(view.navigation._autolayout.right.value).toBe(920);
            expect(view.navigation._autolayout.left.value).toBe(0);
            expect(view.navigation._autolayout.width.value).toBe(80);

            expect(view.navigation._autolayout.bottom.value).toBe(720);
            expect(view.navigation._autolayout.top.value).toBe(0);
            expect(view.navigation._autolayout.height.value).toBe(80);
            done();
        };
    });

    xit('handles right simple constraint', function(done){
        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'right',
                    relatedBy: '==', // '=|>=|<='
                    constant: 80
                },
                {
                    item: 'navigation',
                    attribute: 'bottom',
                    relatedBy: '==', // '=|>=|<='
                    constant: 80
                },

            ]
        });
        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        region.show(view);

        view.onShow = function(){
            expect(view.navigation._autolayout.right.value).toBe(80);
            expect(view.navigation._autolayout.left.value).toBe(0);
            expect(view.navigation._autolayout.width.value).toBe(920);

            expect(view.navigation._autolayout.bottom.value).toBe(80);
            expect(view.navigation._autolayout.top.value).toBe(0);
            expect(view.navigation._autolayout.height.value).toBe(720);
            done();
        };
    });

    xit('handles top and bottom simple constraint', function(done){
        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'top',
                    relatedBy: '==', // '=|>=|<='
                    constant: 80
                },
                {
                    item: 'navigation',
                    attribute: 'bottom',
                    relatedBy: '==', // '=|>=|<='
                    constant: 80
                },
            ]
        });
        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        region.show(view);

        view.onShow = function(){
            expect(view.navigation._autolayout.bottom.value).toBe(80);
            expect(view.navigation._autolayout.top.value).toBe(80);
            expect(view.navigation._autolayout.height.value).toBe(640);
            done();
        };
    });


    xit('handles constraints outside of bounds of parent', function(done){
        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'left',
                    relatedBy: '==', // '=|>=|<='
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
        region.show(view);

        view.onShow = function(){
            expect(view.navigation._autolayout.left.value).toBe(800);
            expect(view.navigation._autolayout.width.value).toBe(800);
            expect(view.navigation._autolayout.right.value).toBe(-600);

            expect(view.navigation._autolayout.top.value).toBe(800);
            expect(view.navigation._autolayout.height.value).toBe(800);
            expect(view.navigation._autolayout.bottom.value).toBe(-800);
            done();
        };
    });

    xit('adds constraints based on parent', function(done){
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
        region.show(view);

        view.onShow = function(){
            expect(view.navigation._autolayout.left.value).toBe(0);
            expect(view.navigation._autolayout.width.value).toBe(540);
            expect(view.navigation._autolayout.right.value).toBe(460);

            expect(view.navigation._autolayout.top.value).toBe(0);
            expect(view.navigation._autolayout.height.value).toBe(440);
            expect(view.navigation._autolayout.bottom.value).toBe(360);
            done();
        };
    });

    it('adds constraints based on sibling', function(done){
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
                    toAttribute: 'right'
                },

            ]
        });
        view.navigation = new RectangleView({
            model:model,
        });
        view.navigation.name = 'navigation';

        view.button = new RectangleView({
            model:model,
        });
        view.button.name = 'button';
        view.name = 'view';
        view.addSubview(view.navigation);
        view.addSubview(view.button);
        region.show(view);

        view.onShow = function(){
            // console.log(view.navigation._autolayout.width)
            // console.log(view.button._autolayout.width)
            console.log('-', view.navigation._autolayout.left);
            console.log('-', view.navigation._autolayout.right);
            console.log('-', view.navigation._autolayout.width);

            console.log('+', view.button._autolayout.left);
            console.log('+', view.button._autolayout.right);
            console.log('+', view.button._autolayout.width);
            // console.log(view.button._autolayout.left)
            done();
        };
    });


}); // eof describe
}); // eof define
