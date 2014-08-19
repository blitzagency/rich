define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var utils = require('rich/utils');
var scroll = require('rich/scrollview/scrollview');
var BounceDriver = require('rich/scrollview/scroll-drivers/bounce').BounceDriver;
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var LongView = require('app/shared/views/long-view').LongView;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Layout:', function() {
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

        expect($el.length).toEqual(1);
    });

    afterEach(function() {
        utils.disposeRichContext(root);
        region = null;
        root = null;
    });


    it('basic driver scrolls to a scrolled position', function(done){
        var model = new Rectangle();
        var view = new LongView({
            model: model,
            isVerticle: true
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [800, 4000],
            direction: scroll.DIRECTION_Y,
            scrollDriver: BounceDriver
        });

        scrollView.addSubview(view);

        region.show(scrollView);

        render().then(function(){
            var initPos = scrollView._particle.getPosition();
            scrollView.setScrollPosition(0, -500);

            wait(100).then(function(){
                expect(initPos).toEqual([0, 0, 0]);
                expect(scrollView._particle.getPosition()).toEqual([0, -500, 0]);
                done();
            });
        });
    });

    it('basic driver animates to a scrolled position', function(done){
        var model = new Rectangle();
        var view = new LongView({
            model: model,
            isVerticle: true
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [800, 4000],
            direction: scroll.DIRECTION_Y
        });

        scrollView.addSubview(view);

        region.show(scrollView);

        render().then(function(){
            scrollView.setScrollPosition(0, -500, {
                duration: 500
            });

            var position = scrollView._particle.getPosition();
            wait(100).then(function(){
                expect(position).not.toEqual(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(300).then(function(){
                expect(position).not.toEqual(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(400).then(function(){
                expect(position).not.toEqual(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(500).then(function(){
                expect(scrollView._particle.getPosition()).toEqual([0, -500, 0]);
                done();
            });


        });
    });

    it('bounce driver scrolls to a scrolled position', function(done){
        var model = new Rectangle();
        var view = new LongView({
            model: model,
            isVerticle: true
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [800, 4000],
            direction: scroll.DIRECTION_Y,
            scrollDriver: BounceDriver
        });

        scrollView.addSubview(view);

        region.show(scrollView);

        render().then(function(){
            var initPos = scrollView._particle.getPosition();
            scrollView.setScrollPosition(0, -500);

            wait(100).then(function(){
                expect(initPos).toEqual([0, 0, 0]);
                expect(scrollView._particle.getPosition()).toEqual([0, -500, 0]);
                done();
            });
        });
    });

    it('bounce driver animates to a scrolled position', function(done){
        var model = new Rectangle();
        var view = new LongView({
            model: model,
            isVerticle: true
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [800, 4000],
            direction: scroll.DIRECTION_Y,
            scrollDriver: BounceDriver
        });

        scrollView.addSubview(view);

        region.show(scrollView);

        render().then(function(){
            scrollView.setScrollPosition(0, -500, {
                duration: 500
            });

            var position = scrollView._particle.getPosition();
            wait(100).then(function(){
                expect(position).not.toEqual(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(300).then(function(){
                expect(position).not.toEqual(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(400).then(function(){
                expect(position).not.toEqual(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(500).then(function(){
                expect(scrollView._particle.getPosition()).toEqual([0, -500, 0]);
                done();
            });


        });
    });

    it('basic driver scrolls to a scrolled position horizontally', function(done){
        var model = new Rectangle();
        var view = new LongView({
            model: model,
            isVerticle: false
        });

        var scrollView = new scroll.ScrollView({
            contentSize: [4000, 4000],
            direction: scroll.DIRECTION_X,
            scrollDriver: BounceDriver
        });

        scrollView.addSubview(view);

        region.show(scrollView);

        render().then(function(){
            var initPos = scrollView._particle.getPosition();
            scrollView.setScrollPosition(-500, 0);
            wait(100).then(function(){
                expect(initPos).toEqual([0, 0, 0]);
                expect(scrollView._particle.getPosition()).toEqual([-500, 0, 0]);
                done();
            });
        });
    });

    it('basic driver animates to a scrolled position horizontally', function(done){
        var model = new Rectangle();
        var view = new LongView({
            model: model,
            isVerticle: false
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [4000, 4000],
            direction: scroll.DIRECTION_X
        });

        scrollView.addSubview(view);

        region.show(scrollView);

        render().then(function(){
            scrollView.setScrollPosition(-500, 0, {
                duration: 500
            });

            var position = scrollView._particle.getPosition();
            wait(100).then(function(){
                expect(position).not.toEqual(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(300).then(function(){
                expect(position).not.toEqual(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(400).then(function(){
                expect(position).not.toEqual(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(500).then(function(){
                expect(scrollView._particle.getPosition()).toEqual([-500, 0, 0]);
                done();
            });


        });
    });

    it('bounce driver scrolls to a scrolled position horizontally', function(done){
        var model = new Rectangle();
        var view = new LongView({
            model: model,
            isVerticle: false
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [4000, 4000],
            direction: scroll.DIRECTION_X,
            scrollDriver: BounceDriver
        });

        scrollView.addSubview(view);

        region.show(scrollView);

        render().then(function(){
            var initPos = scrollView._particle.getPosition();
            scrollView.setScrollPosition(-500, 0);

            wait(100).then(function(){
                expect(initPos).toEqual([0, 0, 0]);
                expect(scrollView._particle.getPosition()).toEqual([-500, 0, 0]);
                done();
            });
        });
    });

    it('bounce driver animates to a scrolled position horizontally', function(done){
        var model = new Rectangle();
        var view = new LongView({
            model: model,
            isVerticle: false
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [4000, 4000],
            direction: scroll.DIRECTION_X,
            scrollDriver: BounceDriver
        });

        scrollView.addSubview(view);

        region.show(scrollView);

        render().then(function(){
            scrollView.setScrollPosition(-500, 0, {
                duration: 500
            });

            var position = scrollView._particle.getPosition();
            wait(100).then(function(){
                expect(position).not.toEqual(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(300).then(function(){
                expect(position).not.toEqual(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(400).then(function(){
                expect(position).not.toEqual(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(500).then(function(){
                expect(scrollView._particle.getPosition()).toEqual([-500, 0, 0]);
                done();
            });


        });
    });


















    // it('basic driver scrolls to a scrolled position', function(done){
    //     var model = new Rectangle();
    //     var view = new LongView({
    //         model: model,
    //         isVerticle: false
    //     });
    //     var scrollView = new scroll.ScrollView({
    //         contentSize: [4000, 4000],
    //         direction: scroll.DIRECTION_X,
    //         // scrollDriver: BounceDriver
    //     });
    //     scrollView.name = 'scrollView;';
    //     scrollView._scrollableView.name = '_scrollableView';
    //     view.name = 'longview';
    //     scrollView.addSubview(view);

    //     region.show(scrollView);

    //     render().then(function(){
    //         var initPos = scrollView._particle.getPosition();
    //         scrollView.setScrollPosition(0, -500);

    //         wait(100).then(function(){
    //             expect(initPos).toEqual([0, 0, 0]);
    //             expect(scrollView._particle.getPosition()).toEqual([0, -500, 0]);
    //             // done();
    //         });
    //     });
    // });

}); // eof describe
}); // eof define
