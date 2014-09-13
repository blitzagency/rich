define(function(require, exports, module) {

// Imports

var _ = require('underscore');
var $ = require('jquery');
var rich = require('rich');
var utils = require('rich/utils');
var NavigationController = require('rich/controllers/navigation').NavigationController;
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Rectangle = require('app/shared/models/rectangle').Rectangle;
var RectangleView = require('app/shared/views/rectangle-view').RectangleView;
var matrix = require('tests/utils/matrix');
var css = require('tests/utils/css');
var render = require('tests/utils/time').render;
var wait = require('tests/utils/time').wait;
var colors = require('tests/utils/colors').blue;
var Setup = require('tests/utils/setup').Setup;
var constraintWithJSON = require('rich/autolayout/constraints').constraintWithJSON;
var log = require('tests/utils/log');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('NavigationController:', function() {

    beforeEach(function() {
        loadFixtures('famous.html');

    });

    afterEach(function() {

    });

    it('starts with root', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var color0 = new Rectangle({
            color: colors[7]
        });

        var color1 = new Rectangle({
            color: colors[4]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var box1 = new RectangleView({
            model: color1,
        });

        var nav = new NavigationController({view: box0});

        root.addSubview(nav);
        root.fillWithSubview(nav);

        nav.onShow = function(){
            var bounds = nav.getBounds();
            expect(bounds.width).toEqual(1000);
            expect(bounds.height).toEqual(800);
            expect(bounds.left).toEqual(0);
            expect(bounds.right).toEqual(0);
            expect(bounds.top).toEqual(0);
            expect(bounds.bottom).toEqual(0);
            context.done();
        };
    });

    it('pushes, pops, pushes, pops with root', function(done){
        var context = new Setup(done);

        var region = context.region;
        var root = context.root;

        var color0 = new Rectangle({
            color: colors[7]
        });

        var color1 = new Rectangle({
            color: colors[4]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var box1 = new RectangleView({
            model: color1,
        });

        var nav = new NavigationController({view: box0});
        root.fillWithSubview(nav);

        wait(500).then(function(){
            nav.pushView(box1);
        });

        wait(1000).then(function(){
            nav.popView();
        });

        wait(1500).then(function(){
            nav.pushView(box1);
        });

        wait(2000).then(function(){
            nav.popView();
        });

        wait(2500).then(function(){
            context.done();
        });

    });

    it('pushes, pushes, pushes, pushes, pops, pops, pops, pops with root', function(done){
        var context = new Setup(done);

        var region = context.region;
        var root = context.root;

        var color0 = new Rectangle({
            color: colors[0]
        });

        var color1 = new Rectangle({
            color: colors[1]
        });

        var color2 = new Rectangle({
            color: colors[2]
        });

        var color3 = new Rectangle({
            color: colors[3]
        });

        var color4 = new Rectangle({
            color: colors[4]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var box1 = new RectangleView({
            model: color1,
        });

        var box2 = new RectangleView({
            model: color2,
        });

        var box3 = new RectangleView({
            model: color3,
        });

        var box4 = new RectangleView({
            model: color4,
        });

        var nav = new NavigationController({view: box0});
        root.fillWithSubview(nav);

        wait(500).then(function(){
            nav.pushView(box1);
        });

        wait(1000).then(function(){
            nav.pushView(box2);
        });

        wait(1500).then(function(){
            nav.pushView(box3);
        });

        wait(2000).then(function(){
            nav.pushView(box4);
        });

        wait(2500).then(function(){
            nav.popView();
        });

        wait(3000).then(function(){
            nav.popView();
        });

        wait(3500).then(function(){
            nav.popView();
        });

        wait(4000).then(function(){
            nav.popView();
        });

        wait(4500).then(function(){
            context.done();
        });

    });

    it('pushes and pops with no root', function(done){
        var context = new Setup(done);
        var region = context.region;
        var root = context.root;

        var color0 = new Rectangle({
            color: colors[7]
        });

        var color1 = new Rectangle({
            color: colors[4]
        });

        var box0 = new RectangleView({
            model: color0,
        });

        var box1 = new RectangleView({
            model: color1,
        });

        var nav = new NavigationController();


        root.fillWithSubview(nav);
        nav.pushView(box0);

        wait(500).then(function(){
            nav.pushView(box1);
        });

        wait(1000).then(function(){
            nav.popView();
        });

        wait(1500).then(function(){
            context.done();
        });
    });




}); // eof describe
}); // eof define
