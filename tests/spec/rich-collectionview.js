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

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('CollectionView:', function() {
    var root;
    var region;
    var context;
    var $el;

    beforeEach(function() {
        loadFixtures('famous-full.html');

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

    it('display views from initial collection (sizeForViewAtIndex)', function(done){

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

        region.name = 'region';
        collectionView.name = 'collectionView';


        region.constraints = function(){
            return [
                'H:|[currentView]|',
                'V:|[currentView]|',
            ];
        };

        region.show(collectionView);

        collectionView.onShow = function(){
            var targetHeight = 20; // sizeForViewAtIndex value

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


            done();
        };

    });

    it('display views from initial collection (intrinsic size)', function(done){

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

        region.name = 'region';
        collectionView.name = 'collectionView';


        region.constraints = function(){
            return [
                'H:|[currentView]|',
                'V:|[currentView]|',
            ];
        };

        region.show(collectionView);

        collectionView.onShow = function(){
            var targetHeight = 50;
            var targetWidth = window.innerWidth;


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

            done();
        };

    });

    it('adds model', function(done){

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

        region.constraints = function(){
            return [
                'H:|[currentView]|',
                'V:|[currentView]|',
            ];
        };

        region.show(collectionView);

        collectionView.onShow = function(){
            var targetHeight = 50;
            var targetWidth = window.innerWidth;
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

                done();
            });
        };
    });

    it('removes model', function(done){

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


        var collection = new backbone.Collection([color0, color1]);


        var collectionView = new rich.CollectionView({
            collection: collection,
            orientation: 'vertical',
            childView: AltView,
            spacing: 5,
        });

        region.constraints = function(){
            return [
                'H:|[currentView]|',
                'V:|[currentView]|',
            ];
        };

        region.show(collectionView);

        collectionView.onShow = function(){
            var targetHeight = 50;
            var targetWidth = window.innerWidth;
            var $child;

            expect($el.children().length).toEqual(2);
            expect(collectionView.children.length).toEqual(2);

            var startCid = collectionView.children.findByIndex(1).cid;

            render().then(function(){
                $child = $($el.children()[1]);
                var targetTranslation = (targetHeight + collectionView.spacing) * 1;
                expect(matrix.getTranslation($child).y).toEqual(targetTranslation);

                collection.remove(color0);

                render().then(function(){
                    // will be 2, famo.us keeps empty nodes around for
                    // recycling purposes.
                    expect($el.children().length).toEqual(2);
                    expect($($el.children()[0]).css('display')).toEqual('none');
                    expect(collectionView.children.length).toEqual(1);
                    expect(collectionView.children.findByIndex(0).cid).toEqual(startCid);

                    $child = $($el.children()[1]);
                    expect(matrix.getTranslation($child).y).toEqual(0);

                    done();
                });
            });
        };
    });


}); // eof describe
}); // eof define
