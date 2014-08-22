define(function (require, exports, module) {

var rich = require('rich');
var backbone = require('backbone');
var Modifier = require('famous/core/Modifier');
var utils = require('app/utils');
var template = require('hbs!../templates/cube-view');
var Easing = require('famous/transitions/Easing');
var Transform = require('famous/core/Transform');
var CubeSide = require('../models/cube-side').CubeSide;
var CubeSideView = require('./cube-side-view').CubeSideView;

var w = window.innerWidth;
var h = window.innerHeight;

var CubeView = rich.CollectionView.extend({
    className: 'cube-view',
    childView: CubeSideView,
    _yPos: 0,
    _rotation: 0,
    events: {
        'childview:click': 'wantsRotateCube'
    },

    initialize: function(){

        this.rotation = 0;

        var front = new CubeSide({
            size: [w, h],
            color: utils.colors.blue[1],
            content: 'front',
            tz: h/2
        });

        var back = new CubeSide({
            size: [w, h],
            color: utils.colors.blue[3],
            content: 'back',
            rx: Math.PI,
            tz: h/2,
        });

        var top = new CubeSide({
            size: [w, h],
            color: utils.colors.blue[5],
            content: 'top',
            rx: Math.PI/2,
            tz: h/2,
        });

        var bottom = new CubeSide({
            size: [w, h],
            color: utils.colors.blue[7],
            content: 'bottom',
            rx: 1.5 * Math.PI,
            tz: h/2,
        });

        this.collection = new backbone.Collection([front, back, top, bottom]);

        // prep for animation and move
        // container with scrollView
        var rotationMod = new Modifier();
        var positionMod = new Modifier();

        this.modifier = [positionMod, rotationMod];

        var self = this;

        positionMod.transformFrom(function(){
            return Transform.translate(0, self._yPos, -h/2);
        });

        rotationMod.transformFrom(function(){
            return Transform.rotateX(self._rotation);
        });

        // this.on('childview:click', this.wantsRotateCube.bind(this));

    },

    onShow: function(){
    },

    modifierForViewAtIndex: function(){
        return new Modifier();
    },

    scrollPosition: function(yPos){
        if(yPos < 1){
            this._yPos = 0;
            this._rotation = 0;
            this.invalidateView();
            return;
        }
        this._yPos = yPos;


        // set h var for scroll length
        var percent = Math.abs(yPos/(h));
        this._rotation = percent;
        this.invalidateView();

        // this.setRotationPos(percent);
    },

    wantsSnapToScroll: function(){
        var percent = this._yPos / h;
        var duration = 1000;
        if (percent < 0.785) {
            this.scrollView.setScrollPosition(0, 0 , true,
                {duration: duration, curve: Easing.inOutQuad});
        }
    },

    // wantsRotateCube: function(){
    //     this.rotateCube();
    // },

    // radiansCalc: function(degrees){
    //     return degrees * Math.PI / 180;
    // },

    // rotateCube: function(){
    //     this.rotation += this.radiansCalc(90);

    //     var duration = 1000;
    //     this.setTransform(
    //         Transform.rotateX(this.rotation),
    //         {duration: duration, curve: Easing.outQuad});
    // },

});

exports.CubeView = CubeView;

});
