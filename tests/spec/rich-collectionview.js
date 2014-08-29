define(function(require, exports, module) {

// Imports

var $ = require('jquery');
var _ = require('underscore');
var backbone = require('backbone');
var rich = require('rich');
var utils = require('rich/utils');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var colors = require('tests/utils/colors').blue;
var css = require('tests/utils/css');
var matrix = require('tests/utils/matrix');
var log = require('tests/utils/log');
var constraintsWithVFL = require('rich/autolayout/constraints').constraintsWithVFL;
var Setup = require('tests/utils/setup').Setup;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('CollectionView:', function() {

    beforeEach(function() {
        loadFixtures('famous-full.html');
    });

    afterEach(function() {

    });

    it('display views from initial collection (sizeForViewAtIndex)', function(done){
        var context = new Setup(done);

        var color0 = new Rectangle({
            color: colors[7]
        });

        var color1 = new Rectangle({
            color: colors[6]
        });

        var color2 = new Rectangle({
            color: colors[5]
        });

        var color3 = new Rectangle({
            color: colors[4]
        });


        var collection = new backbone.Collection([
            color0, color1, color2, color3]);


        var collectionView = new rich.CollectionView({
            collection: collection,
            orientation: 'vertical',
            childView: RectangleView,
            spacing: 1,

            sizeForViewAtIndex: function(view, index){
                return [0, 20];
            }
        });

        context.region.name = 'region';
        collectionView.name = 'collectionView';

        context.region.show(collectionView);

        collectionView.onShow = function(){
            var targetHeight = 20; // sizeForViewAtIndex value
            var $el = context.$el;

            expect($el.children().length).toEqual(4);
            var startColor = 7;

            _.each($el.children(), function(child, index){
                var $child = $(child);
                // http://jsperf.com/getting-first-child-element-using-jquery/3
                var $rect = $($child.children()[0]);

                var value = css.rgb2hex($rect.css('backgroundColor'));
                var targetValue = colors[startColor - index];
                var targetTranslation = (targetHeight + collectionView.spacing) * index;

                expect($child.height()).toEqual(targetHeight);
                expect(value).toEqual(targetValue);
                expect(matrix.getTranslation($child).y).toEqual(targetTranslation);

            });


            context.done();
        };

    });

    it('display views from initial collection (intrinsic size)', function(done){
        var context = new Setup(done);
        var AltView = RectangleView.extend({
            size: [0, 50]
        });

        var color0 = new Rectangle({
            color: colors[7]
        });

        var color1 = new Rectangle({
            color: colors[6]
        });

        var color2 = new Rectangle({
            color: colors[5]
        });

        var color3 = new Rectangle({
            color: colors[4]
        });


        var collection = new backbone.Collection([
            color0, color1, color2, color3]);


        var collectionView = new rich.CollectionView({
            collection: collection,
            orientation: 'vertical',
            childView: AltView,
            spacing: 5,
        });

        context.region.name = 'region';
        collectionView.name = 'collectionView';
        context.region.show(collectionView);

        collectionView.onShow = function(){
            var targetHeight = 50;
            var targetWidth = window.innerWidth;
            var $el = context.$el;

            expect($el.children().length).toEqual(4);
            var startColor = 7;

            _.each($el.children(), function(child, index){
                var $child = $(child);
                var $rect = $($child.children()[0]);

                var value = css.rgb2hex($rect.css('backgroundColor'));
                var targetValue = colors[startColor - index];
                var targetTranslation = (targetHeight + collectionView.spacing) * index;

                expect($child.height()).toEqual(targetHeight);
                expect($child.width()).toEqual(targetWidth);

                expect(value).toEqual(targetValue);
                expect(matrix.getTranslation($child).y).toEqual(targetTranslation);

            });

            context.done();
        };

    });

    it('adds model', function(done){
        var context = new Setup(done);
        var AltView = RectangleView.extend({
            size: [0, 50]
        });

        var color0 = new Rectangle({
            color: colors[7]
        });

        var color1 = new Rectangle({
            color: colors[6]
        });

        var color2 = new Rectangle({
            color: colors[5]
        });

        var color3 = new Rectangle({
            color: colors[4]
        });


        var collection = new backbone.Collection([color0]);


        var collectionView = new rich.CollectionView({
            collection: collection,
            orientation: 'vertical',
            childView: AltView,
            spacing: 5,
        });

        context.region.show(collectionView);

        collectionView.onShow = function(){
            var targetHeight = 50;
            var targetWidth = window.innerWidth;
            var $el = context.$el;
            var $child;

            $child = $($el.children()[0]);

            expect($el.children().length).toEqual(1);
            expect(collectionView.children.length).toEqual(1);
            expect($child.height()).toEqual(targetHeight);

            var startCid = collectionView.children.findByIndex(0).cid;

            collection.add(color1);

            render().then(function(){

                expect(collectionView.children.findByIndex(0).cid).toEqual(startCid);
                expect($el.children().length).toEqual(2);
                expect(collectionView.children.length).toEqual(2);

                _.each($el.children(), function(child, index){
                    $child = $($el.children()[index]);
                    var targetTranslation = (targetHeight + collectionView.spacing) * index;
                    expect(matrix.getTranslation($child).y).toEqual(targetTranslation);
                    expect($child.height()).toEqual(targetHeight);
                    expect($child.width()).toEqual(targetWidth);
                });

                context.done();
            });
        };
    });

    it('removes model', function(done){
        var context = new Setup(done);
        var AltView = RectangleView.extend({
            size: [0, 50]
        });

        var color0 = new Rectangle({
            color: colors[7]
        });

        var color1 = new Rectangle({
            color: 'red'
        });

        var color2 = new Rectangle({
            color: colors[5]
        });

        var color3 = new Rectangle({
            color: colors[4]
        });


        var collection = new backbone.Collection([color0, color1, color2, color3]);


        var collectionView = new rich.CollectionView({
            collection: collection,
            orientation: 'vertical',
            childView: AltView,
            spacing: 5,
        });

        context.region.show(collectionView);

        collectionView.onShow = function(){
            var targetHeight = 50;
            var targetWidth = window.innerWidth;
            var $child;
            var $el = context.$el;

            expect($el.children().length).toEqual(4);
            expect(collectionView.children.length).toEqual(4);

            var startCid = collectionView.children.findByIndex(3).cid;

            render().then(function(){

                _.each($el.children(), function(child, index){
                    $child = $($el.children()[index]);
                    var targetTranslation = (targetHeight + collectionView.spacing) * index;
                    expect(matrix.getTranslation($child).y).toEqual(targetTranslation);
                    expect($child.height()).toEqual(targetHeight);
                    expect($child.width()).toEqual(targetWidth);
                });

                collection.remove(color2);

                render().then(function(){

                    // will be 4 like when we began, famo.us keeps empty nodes
                    // around for recycling purposes.
                    expect($el.children().length).toEqual(4);
                    expect(collectionView.children.length).toEqual(3);
                    expect($($el.children()[2]).css('display')).toEqual('none');

                    // ensure the cid of the last view, index 3, is the same
                    // but now at index 2
                    expect(collectionView.children.findByIndex(2).cid).toEqual(startCid);

                    // make sure everything is where we think it should be
                    collectionView.children.each(function(child, index){
                        var targetTranslation = (targetHeight + collectionView.spacing) * index;
                        $child = child.$el;
                        expect(matrix.getTranslation($child).y).toEqual(targetTranslation);
                        expect($child.height()).toEqual(targetHeight);
                        expect($child.width()).toEqual(targetWidth);
                    });

                    context.done();
                });
            });
        };
    });

    it('resets', function(done){
        var context = new Setup(done);
        var AltView = RectangleView.extend({
            size: [0, 50]
        });

        var color0 = new Rectangle({
            color: 'green'
        });

        var color1 = new Rectangle({
            color: 'red'
        });

        var color2 = new Rectangle({
            color: colors[5]
        });

        var color3 = new Rectangle({
            color: colors[4]
        });


        var collection = new backbone.Collection([color0, color1, color2]);

        var collectionView = new rich.CollectionView({
            collection: collection,
            orientation: 'vertical',
            childView: AltView,
            spacing: 5,
        });


        context.region.show(collectionView);

        collectionView.onShow = function(){
            var targetHeight = 50;
            var targetWidth = window.innerWidth;
            var $child;
            var $el = context.$el;

            expect($el.children().length).toEqual(3);
            expect(collectionView.children.length).toEqual(3);

            render().then(function(){


                collection.reset([color2, color3]);

                render().then(function(){
                    expect($el.children().length).toEqual(5);
                    expect(collectionView.children.length).toEqual(2);

                    // console.log($($el.children()[0]).css('display'));
                    // console.log($($el.children()[1]).css('display'));
                    // console.log($($el.children()[2]).css('display'));
                    // console.log($($el.children()[3]).css('display'));
                    // console.log($($el.children()[4]).css('display'));

                    // expect($($el.children()[0]).css('display')).toEqual('none');
                    // expect($($el.children()[1]).css('display')).toEqual('none');
                    // expect($($el.children()[2]).css('display')).toEqual('none');

                    var $rect3 = $($el.children()[3]).find(':first-child');
                    var $rect4 = $($el.children()[4]).find(':first-child');

                    var color5 = css.rgb2hex($rect3.css('backgroundColor'));
                    var color4 = css.rgb2hex($rect4.css('backgroundColor'));

                    expect(color5).toEqual(colors[5]);
                    expect(color4).toEqual(colors[4]);

                    context.done();
                });
            });
        };
    });

    it('inherits vertical size for horizontal orientation', function(done){
        var context = new Setup(done);
        var root = context.root;

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
            color: colors[5]
        });

        var color3 = new Rectangle({
            color: colors[4]
        });


        var collection = new backbone.Collection([color0, color1]);

        AltView.prototype._render = function(){
            //debugger;
            rich.View.prototype._render.apply(this, arguments);
        };

        var collectionView = new rich.CollectionView({
            collection: collection,
            orientation: 'horizontal',
            childView: AltView,
            spacing: 0,
        });

        var layout = new rich.View({
            constraints: function(){
                return [
                    {
                        item: collectionView,
                        attribute: 'height',
                        relatedBy: '==',
                        constant: 100,
                    },

                    {
                        item: collectionView,
                        attribute: 'width',
                        relatedBy: '==',
                        toItem: 'superview',
                        toAttribute: 'width'
                    }
                ];
            }
        });


        layout.addSubview(collectionView);
        root.addSubview(layout);

        var c1 = constraintsWithVFL('H:|[view]|', {view: layout});
        var c2 = constraintsWithVFL('V:|[view]|', {view: layout});
        root.constraints = [].concat(c1, c2);

        collectionView.name = 'collectionView';

        layout.onShow = function(){
            var child = collectionView.children.findByIndex(0);

            expect(child._autolayout.width.value).toEqual(100);
            expect(child._autolayout.height.value).toEqual(100);

            context.done();
        };

    });

    it('initializes from reset', function(done){
        var context = new Setup(done);
        var root = context.root;

        var AltView = RectangleView.extend({
            size: [0, 50]
        });

        var color0 = new Rectangle({
            color: 'green'
        });

        var color1 = new Rectangle({
            color: 'red'
        });

        var color2 = new Rectangle({
            color: colors[5]
        });

        var color3 = new Rectangle({
            color: colors[4]
        });


        var collection = new backbone.Collection();

        var layout = new rich.View({
            constraints: function(){
                return [
                    {
                        item: collectionView,
                        attribute: 'width',
                        relatedBy: '==',
                        constant: 50,
                    },

                    {
                        item: collectionView,
                        attribute: 'width',
                        relatedBy: '==',
                        toItem: 'superview',
                        toAttribute: 'width'
                    }
                ];
            }
        });

        var collectionView = new rich.CollectionView({
            collection: collection,
            orientation: 'vertical',
            childView: AltView,
            spacing: 0,
        });


        layout.addSubview(collectionView);
        root.addSubview(layout);

        var c1 = constraintsWithVFL('H:|[view]|', {view: layout});
        var c2 = constraintsWithVFL('V:|[view]|', {view: layout});
        root.constraints = [].concat(c1, c2);

        collection.reset([color0, color1, color2]);

        collectionView.onShow = function(){
            var targetWidth = window.innerWidth;
            var targetHeight = 50;

            collectionView.children.each(function(child){
                expect(child._autolayout.width.value).toEqual(targetWidth);
                expect(child._autolayout.height.value).toEqual(targetHeight);
            });

            context.done();
        };

    });


}); // eof describe
}); // eof define
