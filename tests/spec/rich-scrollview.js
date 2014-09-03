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
var Setup = require('tests/utils/setup').Setup;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Layout:', function() {


    beforeEach(function() {
        loadFixtures('famous.html');
    });

    afterEach(function() {

    });


    it('basic driver scrolls to a scrolled position', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var model = new Rectangle();
        var view = new LongView({
            model: model,
            isVerticle: true
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [800, 4000],
            direction: scroll.DIRECTION_Y,
        });

        scrollView.show(view);

        region.show(scrollView);

        render().then(function(){
            var initPos = scrollView._particle.getPosition();
            scrollView.setScrollPosition(0, -500);

            wait(100).then(function(){
                expect(initPos).toEqual([0, 0, 0]);
                expect(scrollView._particle.getPosition()).toEqual([0, -500, 0]);
                context.done();
            });
        });
    });

    it('basic driver animates to a scrolled position', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var model = new Rectangle();
        var view = new LongView({
            model: model,
            isVerticle: true
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [800, 4000],
            direction: scroll.DIRECTION_Y
        });

        scrollView.show(view);

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

            wait(600).then(function(){
                expect(scrollView._particle.getPosition()).toEqual([0, -500, 0]);
                context.done();
            });


        });
    });

    it('bounce driver scrolls to a scrolled position', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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

        scrollView.show(view);

        region.show(scrollView);

        render().then(function(){
            var initPos = scrollView._particle.getPosition();
            scrollView.setScrollPosition(0, -500);

            wait(100).then(function(){
                expect(initPos).toEqual([0, 0, 0]);
                expect(scrollView._particle.getPosition()).toEqual([0, -500, 0]);
                context.done();
            });
        });
    });

    it('bounce driver animates to a scrolled position', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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

        scrollView.show(view);

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

            wait(530).then(function(){
                expect(scrollView._particle.getPosition()).toEqual([0, -500, 0]);
                context.done();
            });


        });
    });

    it('basic driver scrolls to a scrolled position horizontally', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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

        scrollView.show(view);

        region.show(scrollView);

        render().then(function(){
            var initPos = scrollView._particle.getPosition();
            scrollView.setScrollPosition(-500, 0);
            wait(100).then(function(){
                expect(initPos).toEqual([0, 0, 0]);
                expect(scrollView._particle.getPosition()).toEqual([-500, 0, 0]);
                context.done();
            });
        });
    });

    it('basic driver animates to a scrolled position horizontally', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var model = new Rectangle();
        var view = new LongView({
            model: model,
            isVerticle: false
        });
        var scrollView = new scroll.ScrollView({
            contentSize: [4000, 4000],
            direction: scroll.DIRECTION_X
        });

        scrollView.show(view);

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

            wait(600).then(function(){
                expect(scrollView._particle.getPosition()).toEqual([-500, 0, 0]);
                context.done();
            });


        });
    });

    it('bounce driver scrolls to a scrolled position horizontally', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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

        scrollView.show(view);

        region.show(scrollView);

        render().then(function(){
            var initPos = scrollView._particle.getPosition();
            scrollView.setScrollPosition(-500, 0);

            wait(100).then(function(){
                expect(initPos).toEqual([0, 0, 0]);
                expect(scrollView._particle.getPosition()).toEqual([-500, 0, 0]);
                context.done();
            });
        });
    });

    it('bounce driver animates to a scrolled position horizontally', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

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

        scrollView.show(view);

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

            wait(510).then(function(){
                expect(scrollView._particle.getPosition()).toEqual([-500, 0, 0]);
                context.done();
            });


        });
    });

}); // eof describe
}); // eof define
