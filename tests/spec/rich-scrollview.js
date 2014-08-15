define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var scroll = require('rich/scrollview/scrollview');
var BouncePlugin = require('rich/scrollview/scroll-drivers/bounce').BouncePlugin;
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var LongView = require('app/shared/views/long-view').LongView;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Layout:', function() {
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
        region = null;
    });


    it('basic plugin scrolls to a scrolled position', function(done){
        var model = new Rectangle();
        var view = new LongView({
            model: model
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [800, 4000],
            direction: scroll.DIRECTION_Y
        });
        scrollView.name = 'scrollView;';
        scrollView._scrollableView.name = '_scrollableView';
        view.name = 'longview';
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

    it('basic plugin animates to a scrolled position', function(done){
        var model = new Rectangle();
        var view = new LongView({
            model: model
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [800, 4000],
            direction: scroll.DIRECTION_Y
        });
        scrollView.name = 'scrollView;';
        scrollView._scrollableView.name = '_scrollableView';
        view.name = 'longview';
        scrollView.addSubview(view);

        region.show(scrollView);

        render().then(function(){
            scrollView.setScrollPosition(0, -500, {
                duration: 500
            });

            var position = scrollView._particle.getPosition();
            wait(100).then(function(){
                expect(position).not.toBe(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(300).then(function(){
                expect(position).not.toBe(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(400).then(function(){
                expect(position).not.toBe(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(500).then(function(){
                expect(scrollView._particle.getPosition()).toEqual([0, -500, 0]);
                done();
            });


        });
    });

    it('bounce plugin scrolls to a scrolled position', function(done){
        var model = new Rectangle();
        var view = new LongView({
            model: model
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [800, 4000],
            direction: scroll.DIRECTION_Y,
            scrollPlugin: BouncePlugin
        });
        scrollView.name = 'scrollView;';
        scrollView._scrollableView.name = '_scrollableView';
        view.name = 'longview';
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

    it('bounce plugin animates to a scrolled position', function(done){
        var model = new Rectangle();
        var view = new LongView({
            model: model
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [800, 4000],
            direction: scroll.DIRECTION_Y,
            scrollPlugin: BouncePlugin
        });
        scrollView.name = 'scrollView;';
        scrollView._scrollableView.name = '_scrollableView';
        view.name = 'longview';
        scrollView.addSubview(view);

        region.show(scrollView);

        render().then(function(){
            scrollView.setScrollPosition(0, -500, {
                duration: 500
            });

            var position = scrollView._particle.getPosition();
            wait(100).then(function(){
                expect(position).not.toBe(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(300).then(function(){
                expect(position).not.toBe(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(400).then(function(){
                expect(position).not.toBe(scrollView._particle.getPosition());
                position = scrollView._particle.getPosition();
            });

            wait(500).then(function(){
                expect(scrollView._particle.getPosition()).toEqual([0, -500, 0]);
                done();
            });


        });
    });

}); // eof describe
}); // eof define
