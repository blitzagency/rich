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

        render(100).then(function(){
            expect(view.navigation.getSize()).toEqual([100, 200]);
            done();
        });
    });

    xit('inherits size', function(done){
        var model = new Rectangle();

        var view = new RectangleView({
            model: model,
        });
        view.navigation = new rich.View({});
        view.addSubview(view.navigation);
        region.show(view);

        render(100).then(function(){
            expect(view.navigation.getSize()).toEqual([1000, 800]);
            done();
        });
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
                }
            ]
        });
        view.navigation = new RectangleView({
            model:model,
            size: [100, 200]
        });
        view.addSubview(view.navigation);
        region.show(view);

        render(100).then(function(){
            expect(view.navigation.getSize()).toEqual([100, 200]);
            done();
        });
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
                }
            ]
        });
        view.navigation = new RectangleView({
            model:model,
        });
        view.addSubview(view.navigation);
        region.show(view);

        render(100).then(function(){
            expect(view.navigation.getSize()).toEqual([500, 800]);
            done();
        });
    });

    xit('handles multiple simple constraints', function(done){
        var model = new Rectangle();
        var view = new RectangleView({
            model: model,
            constraints: [
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '>=', // '=|>=|<='
                    constant: 50
                },
                {
                    item: 'navigation',
                    attribute: 'width',
                    relatedBy: '<=', // '=|>=|<='
                    constant: 100
                },

            ]
        });
        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        region.show(view);

        render(100).then(function(){
            expect(view.navigation.getSize()).toEqual([100, 800]);
            done();
        });
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

        render(100).then(function(){
            expect(view.navigation._autolayout.left.value).toBe(20);
            done();
        });
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
                    constant: 20
                },

            ]
        });
        view.navigation = new RectangleView({
            model:model,
        });

        view.addSubview(view.navigation);
        region.show(view);

        render(100).then(function(){
            console.log(view.navigation._autolayout.right)
            console.log(view.navigation._autolayout.left)
            console.log(view.navigation._autolayout.width)
            // expect(view.navigation._autolayout.left.value).toBe(20);
            done();
        });
    });


}); // eof describe
}); // eof define
