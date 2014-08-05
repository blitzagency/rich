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


    it('initializes autolayout', function(){
        var model = new Rectangle();
        var view = new RectangleView({model: model});
        region.show(view);
        expect(view._autolayout).not.toBe(undefined);
    });

    it('sets explicit size on subview', function(done){
        var model = new Rectangle();

        var view = new RectangleView({
            model: model,
            // constraints: [
            //     {
            //         item: 'navigation',
            //         attribute: 'width',
            //         relatedBy: '==', // '=|>=|<='
            //         toItem: 'superview', //'null is superview'
            //         toAttribute: 'width',
            //         multiplier: 0.5,
            //         constant: 0
            //     }
            // ]
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

    it('inherits size', function(done){
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

        // render().then(function(){
        //     expect(view.navigation.getSize()).toEqual([1000, 800]);
        //     done();
        // });
    });

    it('ignores constraints over explicit size', function(done){
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

    it('uses constraints with superview, ==, and width', function(done){
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
                }
            ]
        });

        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        region.show(view);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([500, 800]);
            done();
        };
    });

    it('handles multiple simple constraints', function(done){
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


            ]
        });
        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        region.show(view);

        view.onShow = function(){
            expect(view.navigation.getSize()).toEqual([100, 800]);
            done();
        };
    });

    it('handles left simple constraint', function(done){
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

    it('handles width simple constraint', function(done){
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
            done();
        };
    });

    it('handles right simple constraint', function(done){
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
            done();
        };
    });

    it('handles top and bottom simple constraint', function(done){
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


    it('handles constraints outside of bounds of parent', function(done){
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
            ]
        });
        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        region.show(view);

        view.onShow = function(){
            expect(view.navigation._autolayout.left.value).toBe(800)
            expect(view.navigation._autolayout.width.value).toBe(800)
            expect(view.navigation._autolayout.right.value).toBe(-600)
            done();
        };
    });


}); // eof describe
}); // eof define
